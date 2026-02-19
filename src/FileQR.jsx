import React, { useEffect, useRef } from 'react'
import QRious from 'qrious'

const base64encode = (buf) =>
  btoa(new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), ''))

const fileVal = (file, fileId, offset) => {
  const len = Math.min(file.content.byteLength - offset, 8000)
  return (
    window.origin +
    '/u/' + fileId +
    '/' + encodeURIComponent(base64encode(file.content.slice(offset, offset + len)))
  )
}

export default function FileQR({ file, offset, onUploadCompleted }) {
  const fileId = useRef(
    [...Array(8)].map(() => Math.random().toString(36)[3]).join('')
  )

  useEffect(() => {
    const es = new EventSource('/stream')
    es.onmessage = (event) => {
      const ret = JSON.parse(event.data)
      onUploadCompleted(ret.len)
    }
    return () => es.close()
  }, [onUploadCompleted])

  const progress = (offset / file.content.byteLength) * 100
  const qrVal =
    progress === 100
      ? `${window.origin}/d/${fileId.current}`
      : fileVal(file, fileId.current, offset)
  const foreground = progress === 100 ? '#4E937A' : '#000000'

  const qr = new QRious({ foreground, size: 600, value: qrVal })

  const progressMsg =
    progress === 100 ? (
      <div className="alert alert-success" role="alert">
        Complete! Download here.
      </div>
    ) : (
      <div
        className="progress"
        style={{ width: '600px', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    )

  return (
    <div>
      {progressMsg}
      <img src={qr.toDataURL()} alt="QR Code" />
    </div>
  )
}
