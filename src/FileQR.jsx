import React, { useEffect, useRef, useState } from 'react'
import QRious from 'qrious'

const base64encode = (buf) =>
  btoa(new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), ''))

const CHUNK_SIZE = 800

const chunkData = (file, offset) => {
  const len = Math.min(file.content.byteLength - offset, CHUNK_SIZE)
  const chunkIndex = Math.floor(offset / CHUNK_SIZE)
  return chunkIndex + ':' + base64encode(file.content.slice(offset, offset + len))
}

export default function FileQR({ file, offset, onUploadCompleted }) {
  const fileId = useRef(
    [...Array(8)].map(() => Math.random().toString(36)[3]).join('')
  )
  const [scannerReady, setScannerReady] = useState(false)

  useEffect(() => {
    const es = new EventSource(`/stream/${fileId.current}`)
    es.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'ready') {
        setScannerReady(true)
      } else if (data.type === 'progress') {
        onUploadCompleted(data.len)
      }
    }
    return () => es.close()
  }, [onUploadCompleted])

  const progress = (offset / file.content.byteLength) * 100

  useEffect(() => {
    if (progress >= 100) {
      fetch(`/complete/${fileId.current}`).catch(() => {})
    }
  }, [progress])

  let qrVal
  let foreground = '#000000'
  let statusMsg

  if (progress >= 100) {
    qrVal = `${window.origin}/d/${fileId.current}`
    foreground = '#4E937A'
    statusMsg = (
      <div className="alert alert-success">
        Complete! Download here.
      </div>
    )
  } else if (!scannerReady) {
    qrVal = `${window.origin}/scan/${fileId.current}`
    statusMsg = (
      <p className="muted">
        Scan this QR code with your phone to start the transfer.
      </p>
    )
  } else {
    qrVal = chunkData(file, offset)
    statusMsg = (
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    )
  }

  const qr = new QRious({
    foreground,
    size: 800,
    value: qrVal,
    level: 'M',
  })

  return (
    <div>
      {statusMsg}
      <img
        src={qr.toDataURL()}
        alt="QR Code"
        style={{
          maxWidth: '90vw',
          maxHeight: '70vh',
        }}
      />
    </div>
  )
}
