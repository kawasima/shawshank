import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Layout(props) {
  return(
    <div className="container">
      {props.children}
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.object.isRequired
}
