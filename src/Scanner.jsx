import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'

export default function Scanner() {
  const { fileId } = useParams()
  const [status, setStatus] = useState('initializing')
  const [uploadedBytes, setUploadedBytes] = useState(0)
  const [complete, setComplete] = useState(false)
  const lastChunkRef = useRef(-1)
  const scannerRef = useRef(null)
  const pendingUploadRef = useRef(null)
  const readerRef = useRef(null)

  // Notify server that scanner is ready
  useEffect(() => {
    fetch(`/ready/${fileId}`).catch(() => {})
  }, [fileId])

  // Listen for progress via SSE
  useEffect(() => {
    const es = new EventSource(`/stream/${fileId}`)
    es.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'progress') {
        setUploadedBytes(data.len)
      } else if (data.type === 'complete') {
        setComplete(true)
        if (scannerRef.current) {
          scannerRef.current.stop().catch(() => {})
        }
        window.location.href = `/download/${fileId}`
      }
    }
    return () => es.close()
  }, [fileId])

  // Start camera and scan
  useEffect(() => {
    if (!readerRef.current) return

    const html5Qrcode = new Html5Qrcode(readerRef.current.id)
    scannerRef.current = html5Qrcode

    html5Qrcode.start(
      { facingMode: 'environment' },
      {
        fps: 30,
        qrbox: { width: 450, height: 450 },
        disableFlip: false,
      },
      async (decodedText) => {
        if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) return

        const colonPos = decodedText.indexOf(':')
        if (colonPos === -1) return
        const chunkIndex = parseInt(decodedText.substring(0, colonPos), 10)
        if (isNaN(chunkIndex)) return
        const base64data = decodedText.substring(colonPos + 1)

        if (chunkIndex <= lastChunkRef.current) return
        lastChunkRef.current = chunkIndex

        // Cancel any in-flight upload that hasn't completed yet
        if (pendingUploadRef.current) {
          pendingUploadRef.current.abort()
        }
        const controller = new AbortController()
        pendingUploadRef.current = controller

        try {
          await fetch(`/u/${fileId}/${encodeURIComponent(base64data)}`, {
            signal: controller.signal,
          })
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Upload error:', err)
          }
        }
      },
      () => {}
    ).then(() => {
      setStatus('scanning')
    }).catch((err) => {
      console.error('Camera error:', err)
      setStatus('error')
    })

    return () => {
      html5Qrcode.stop().catch(() => {})
    }
  }, [fileId])

  if (complete) {
    return (
      <div className="page-top">
        <div className="alert alert-success">
          Transfer complete!
        </div>
        <a href={`/d/${fileId}`} className="btn btn-primary">
          Download file
        </a>
      </div>
    )
  }

  return (
    <div className="page-top">
      <h2>Scanner</h2>
      {status === 'error' && (
        <div className="alert alert-error">
          Camera access denied. Please allow camera permissions.
        </div>
      )}
      {status === 'scanning' && (
        <p className="muted">
          Scanning... ({uploadedBytes} bytes received)
        </p>
      )}
      {status === 'initializing' && (
        <p className="muted">Starting camera...</p>
      )}
      <div ref={readerRef} id="qr-reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }} />
    </div>
  )
}
