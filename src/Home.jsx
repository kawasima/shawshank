import React from 'react'
import FileQR from './FileQR'

export default function Home({ file, offset, onSelectFile, onUploadCompleted }) {
  if (file) {
    return <FileQR file={file} offset={offset} onUploadCompleted={onUploadCompleted} />
  }

  const handleFileSelect = (e) => {
    const selected = e.target.files.item(0)
    if (!selected) return
    const reader = new FileReader()
    reader.onload = () => {
      onSelectFile({ name: selected.name, content: reader.result })
    }
    reader.readAsArrayBuffer(selected)
  }

  return (
    <div>
      <h2>Select file</h2>
      <input name="file" type="file" onChange={handleFileSelect} />
    </div>
  )
}
