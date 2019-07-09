/*eslint-env node*/
const express = require('express')
const path = require('path')
const fs = require('fs')
const atob = require('atob')
const EventEmitter = require('events').EventEmitter
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('./webpack.config.dev')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
}

const options = {
  debug: true
}

function string_to_buffer(src) {
  return (new Uint8Array([].map.call(src, function(c) {
    return c.charCodeAt(0)
  }))).buffer;
}

const ev = new EventEmitter()

const server = require('http').createServer(app)
app.get('/stream', function(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'no-cache');
  const timer = setInterval(function() {
    res.write(':\n\n')
  }, 50000);
  res.write(':\n\n')

  ev.on('data', function(data) {
    res.write('data: ' + data + '\n\n');
  })

  req.on('close', function() {
    clearTimeout(timer);
  })
})

app.get('/d/:fileId', function(req, res) {
  const id = req.params['fileId']
  const filepath = path.join(__dirname, 'data', id)
  res.download(filepath, function(err) {
    fs.unlink(filepath, function(unlinkErr) {
      if (err) throw err;
      console.log(filepath + ' was deleted.');
    });
  })
})

app.get('/u/:fileId/:content', function(req, res) {
  const content = atob(req.params['content'])
  const id = req.params['fileId']
  const filepath = path.join(__dirname, 'data', id)
  fs.appendFile(filepath, new Buffer(string_to_buffer(content)), 'binary', function (err) {
    if (err) {
      throw err
    }
    fs.stat(filepath, function(err, stats) {
      if (err) throw err

      ev.emit('data', JSON.stringify({
        id: id,
        len: stats.size
      }))
    })
  })
  res.send('OK')
})
app.use(express.static(path.join(__dirname, 'public')))
app.get('*', function(req,res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// file cleaning
setInterval(function() {
  fs.readdir(path.join(__dirname, 'data'), function(err, files) {
    if (err) throw err;
    files.filter(function(file) {
      const target = path.join(__dirname, 'data', file);
      fs.stat(target, function(statErr, stats) {
        if (new Date().getTime() - stats.mtime.getTime() > 30 * 60 * 1000) {
          fs.unlink(target, function(unlinkErr) {
            if (unlinkErr) throw err;
            console.log(target + ' was deleted.');
          });
        }
      });
    });
  });
}, 10000);
server.listen(port, function() {
  console.log('start server: port=' + port)
})
