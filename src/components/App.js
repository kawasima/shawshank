import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Layout from './Layout'
import HomeContainer from '../containers/HomeContainer'

const App = () => {
  const routing = (
      <Switch>
        <Route exact path='/' component={HomeContainer}/>
      </Switch>
  )

  return (
    <Router>
      <Layout children={routing}/>
    </Router>
  )
}

export default App
