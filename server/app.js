const fs = require('fs')
const express = require('express')
const path = require('path')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const argv = require('yargs').argv
const pug = require('pug')

const webpack = require('webpack')
const webpackConfig = require('../webpack.config')
const compiler = webpack(webpackConfig)

const app = express()

const userController = require('./controllers/user')

const initialState = JSON.stringify({
  auth: {
    token: null,
    refresh: null,
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

const offlinePageHTML = pug.renderFile(path.join(__dirname, 'views', 'layouts', 'main.pug'), { title: 'MicroTube', initialState })

dotenv.load()

fs.writeFileSync(path.join(__dirname, '../public', 'offline.html'), offlinePageHTML)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.set('partials', path.join(__dirname, 'views', 'partials'))
app.set('port', process.env.PORT)
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

if (process.env.NODE_ENV !== 'production') {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  app.use(require('webpack-hot-middleware')(compiler))
} else {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.get('Host')}${req.url}`)
    }
    next()
 })
}

//Routes
app.post('/auth', userController.auth)
app.post('/auth/refresh', userController.authRefresh)
app.get('/auth/callback', userController.authCallback)

app.use((req, res) => {
  res.render('layouts/main', { title: 'MicroTube', initialState })
})

app.listen(app.get('port'), () => console.log('Express listening on port ' + app.get('port')))

module.exports = app
