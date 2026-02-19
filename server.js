import express from 'express'
import path from 'node:path'
import fs from 'node:fs/promises'
import { EventEmitter } from 'node:events'

const app = express()
const port = process.env.PORT || 3000
const ev = new EventEmitter()
const dataDir = path.join(import.meta.dirname, 'data')

// SSE endpoint for upload progress
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.write(':\n\n')

  const timer = setInterval(() => {
    res.write(':\n\n')
  }, 50000)

  const onData = (data) => {
    res.write(`data: ${data}\n\n`)
  }
  ev.on('data', onData)

  req.on('close', () => {
    clearInterval(timer)
    ev.removeListener('data', onData)
  })
})

// File download (and delete after download)
app.get('/d/:fileId', (req, res) => {
  const id = req.params.fileId
  const filepath = path.join(dataDir, id)
  res.download(filepath, async (err) => {
    if (err) {
      console.error('Download error:', err)
      return
    }
    try {
      await fs.unlink(filepath)
      console.log(`${filepath} was deleted.`)
    } catch (unlinkErr) {
      console.error('Unlink error:', unlinkErr)
    }
  })
})

// File upload chunk via URL parameter
app.get('/u/:fileId/:content', async (req, res) => {
  try {
    const id = req.params.fileId
    const raw = Buffer.from(req.params.content, 'base64')
    const filepath = path.join(dataDir, id)

    await fs.appendFile(filepath, raw)
    const stats = await fs.stat(filepath)
    ev.emit('data', JSON.stringify({ id, len: stats.size }))
    res.send('OK')
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).send('Error')
  }
})

// Serve frontend (production)
app.use(express.static(path.join(import.meta.dirname, 'dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'dist', 'index.html'))
})

// Periodic cleanup of old files (30 minutes)
setInterval(async () => {
  try {
    const files = await fs.readdir(dataDir)
    const now = Date.now()
    for (const file of files) {
      if (file === '.gitkeep') continue
      const target = path.join(dataDir, file)
      const stats = await fs.stat(target)
      if (now - stats.mtimeMs > 30 * 60 * 1000) {
        await fs.unlink(target)
        console.log(`${target} was deleted.`)
      }
    }
  } catch (err) {
    console.error('Cleanup error:', err)
  }
}, 10000)

app.listen(port, () => {
  console.log(`Shawshank server listening on port ${port}`)
})
