// jshint esversion: 6, asi: true
// eslint-env es6

const jwt = require('jsonwebtoken')
const moment = require('moment')
const request = require('request')

const TOKEN_SECRET = 'c68957058f2ead4657e06e19302a2024c9ab61e9f6986c423219e57581a01048'

function generateToken(accessToken) {
  const payload = {
    iss: 'localhost',
    accessToken,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  }
  return jwt.sign(payload, TOKEN_SECRET)
}

/**
 * Login required middleware
 */
exports.ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.status(401).send({ msg: 'Unauthorized' })

exports.authGoogle = (req, res) => {
  const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token'
  const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'

  const params = {
    code: req.body.code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  }

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, (err, response, token) => {
    const accessToken = token.access_token

    const headers = { Authorization: 'Bearer ' + accessToken }

    request.get({ url: peopleApiUrl, headers: headers, json: true }, (err, response, profile) => {
      if (profile.error) {
        return res.status(500).send({ message: profile.error.message })
      }
      res.send({ token: generateToken(accessToken), user: profile })
    })
  })
}

exports.authGoogleCallback = (req, res) => {
  res.render('loading', { layout: false })
}
