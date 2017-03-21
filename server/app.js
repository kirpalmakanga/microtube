// jshint esversion: 6, asi: true
// eslint-env es6

require('babel-core/register')
require('babel-polyfill')

const express = require('express')
const path = require('path')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

const userController = require('./controllers/user')

// React and Server-Side Rendering
const routes = require('../app/routes')
const configureStore = require('../app/store/configureStore').default

let compiler

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.set('partials', path.join(__dirname, 'views', 'partials'))
app.set('port', 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

//Routes
app.post('/auth/google', userController.authGoogle)
app.get('/auth/google/callback', userController.authGoogleCallback)

app.use((req, res) => {
  const initialState = {
    notifications: {}
  }
  const store = configureStore(initialState)

  Router.match({ routes: routes.default(store), location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      res.render('layouts/main', {
        title: 'Youtube Lite',
        html: ReactDOM.renderToString(React.createElement(Provider, { store: store },
          React.createElement(Router.RouterContext, renderProps)
        )),
        initialState: JSON.stringify(store.getState())
      })
    } else {
      res.sendStatus(404)
    }
  })
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})

module.exports = app
