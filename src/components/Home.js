import React from 'react'
import PropTypes from 'prop-types'

import FileQR from './FileQR'

const selectFileHandler = (e, onSelectFile) => onSelectFile(e.target.files.item(0))

const selectFileForm = ({ onSelectFile }) => (
  <div>
    <h2>Select file</h2>
    <input name="file" type="file" value=""
           onChange={e => selectFileHandler(e, onSelectFile) }/>
  </div>
)

export default props => {
  return (props.file) ? <FileQR {...props}/> : selectFileForm(props)
}
