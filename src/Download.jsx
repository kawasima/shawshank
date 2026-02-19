import React from 'react'
import { useParams } from 'react-router-dom'

export default function Download() {
  const { fileId } = useParams()

  return (
    <div>
      <img
        src="/img/completed.png"
        alt="Transfer completed"
        style={{ maxWidth: '80vw', maxHeight: '50vh', marginBottom: '24px' }}
      />
      <div>
        <a href={`/d/${fileId}`} className="btn btn-primary">
          Download file
        </a>
      </div>
    </div>
  )
}
