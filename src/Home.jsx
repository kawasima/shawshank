import React, { useState } from 'react'
import FileQR from './FileQR'

export default function Home({ file, offset, onSelectFile, onUploadCompleted }) {
  const [dragging, setDragging] = useState(false)

  if (file) {
    return <FileQR file={file} offset={offset} onUploadCompleted={onUploadCompleted} />
  }

  const readFile = (f) => {
    const reader = new FileReader()
    reader.onload = () => {
      onSelectFile({ name: f.name, content: reader.result })
    }
    reader.readAsArrayBuffer(f)
  }

  const handleFileSelect = (e) => {
    const selected = e.target.files.item(0)
    if (selected) readFile(selected)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) readFile(dropped)
  }

  return (
    <div>
      <label
        className={`file-select-area${dragging ? ' file-select-dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="file-select-icons">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 4v16M14 4v16M6 4v5m0 6v5m4-16v5m1 0H5v6h6zm-1 6v5m-2-8h-.01"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9h8V5.414a1 1 0 0 1 1.707-.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586A1 1 0 0 1 12 18.586V15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1"/>
          </svg>
        </div>
        <input name="file" type="file" onChange={handleFileSelect} hidden />
      </label>
    </div>
  )
}
