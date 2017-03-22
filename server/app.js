// jshint esversion: 6, asi: true
// eslint-env es6

const express = require('express')
const path = require('path')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const argv = require('yargs').argv

const app = express()

const userController = require('./controllers/user')

dotenv.load()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.set('partials', path.join(__dirname, 'views', 'partials'))
app.set('port', argv.dev ? 3000 : 80)
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

//Routes
app.post('/auth', userController.authGoogle)
app.get('/auth/callback', userController.authGoogleCallback)

app.use((req, res) => {
  res.render('layouts/main', {
    title: 'Youtube Lite',
    initialState: JSON.stringify({
      auth: {
        token: null,
        user: {}
      },
      player: {
        queue: [],
        isPlaying: false,
        isBuffering: false,
        showQueue: false,
        showScreen: false,
        showVolume: false,
        isMuted: false,
        volume: 100,
        video: {
          videoId: null
        },
        loaded: 0,
        currentTime: 0,
        duration: 0,
        youtube: {},
        watchers: {
          time: null,
          loading: null
        },
        newQueueItems: 0
      }
    })
  })
})

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})

module.exports = app
