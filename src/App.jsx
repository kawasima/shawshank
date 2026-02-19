import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './Home'

export default function App() {
  const [file, setFile] = useState(null)
  const [offset, setOffset] = useState(0)

  return (
    <div className="container">
      <div className="py-5 text-center">
        <Home file={file} offset={offset} onSelectFile={setFile} onUploadCompleted={setOffset} />
      </div>
    </div>
  )
}
