import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Home from '../components/Home'

const HomeContainer = props => (
  <Home {...props} />
)

const connector = connect(
  ({ home }) => home,
  dispatch => {
    return {
      onSelectFile: file => {
        const reader = new FileReader()
        reader.onload = e => {
          dispatch({
            type: 'READ_FILE',
            file: {
              name: file.name,
              content: reader.result
            }
          })
        }
        reader.readAsArrayBuffer(file)
      },
      onUploadCompleted: (offset) => {
        dispatch({
          type: 'SET_OFFSET',
          offset: offset
        })
      }
    }
  }
)

export default connector(HomeContainer)
