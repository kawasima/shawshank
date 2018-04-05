import { applyMiddleware, createStore } from 'redux'
import promiseMiddleware from 'redux-promise'
import { createLogger } from 'redux-logger'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'react-router-redux'

import reducer from '../reducers'

const browserHistory = createBrowserHistory()
const store = createStore(
  reducer,
  applyMiddleware(
    routerMiddleware(browserHistory),
    promiseMiddleware,
    createLogger()
  )
)

export {
  store
}
