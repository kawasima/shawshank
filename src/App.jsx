import React, { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './app.css'
import Home from './Home'
import Download from './Download'

const Scanner = lazy(() => import('./Scanner'))

export default function App() {
  const [file, setFile] = useState(null)
  const [offset, setOffset] = useState(0)

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <Home file={file} offset={offset} onSelectFile={setFile} onUploadCompleted={setOffset} />
            }
          />
          <Route
            path="/download/:fileId"
            element={<Download />}
          />
          <Route
            path="/scan/:fileId"
            element={
              <Suspense fallback={<p className="muted">Loading scanner...</p>}>
                <Scanner />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
