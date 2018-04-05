import React from 'react'
import QRCode from 'qrcode.react'

const base64encode = buf => btoa(
  new Uint8Array(buf)
    .reduce((data, byte) => data + String.fromCharCode(byte), '')
)

const fileVal = (file, fileId, offset) => {
  const len = Math.min(file.content.byteLength - offset, 1470)
  return window.origin
    + '/u/' + fileId
    + '/' + encodeURIComponent(base64encode(file.content.slice(offset, offset + len)))
}

export default class FileQR extends React.Component {
  constructor(props) {
    super(props)
    this.fileId = [...Array(8)].map(() => Math.random().toString(36)[3]).join('')
  }
  state = {
    es: null
  }

  componentDidMount() {
    const { onUploadCompleted, offset } = this.props
    const es = new EventSource('/stream')
    es.onmessage = function(event) {
      const ret = JSON.parse(event.data)
      onUploadCompleted(offset + ret.len)
    }
    this.setState({ es })
  }

  render() {
    const { file, offset } = this.props
    const progress = (offset / file.content.byteLength) * 100
    const qrVal = progress === 100 ?
          `${window.origin}/d/${this.fileId}`
          :
          fileVal(file, this.fileId, offset)
    const fgColor = progress === 100 ? '#4E937A' : '#000000'
    return (
      <div>
        <div className="progress" style={
               {
                 width: '512px',
                 marginBottom: '20px'
               }
             }>
          <div className="progress-bar" role="progressbar"
               style={{width: progress + '%'}}
               aria-valuemin="0"
               aria-valuemax="100">
          </div>
        </div>
        <QRCode value={qrVal}
                size={512}
                fgColor={fgColor}/>
      </div>
    )
  }
}
