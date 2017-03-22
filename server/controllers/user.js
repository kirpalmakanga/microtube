// jshint esversion: 6, asi: true
// eslint-env es6
const request = require('request')

const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token'
const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'

exports.authGoogle = (req, res) => {
  const params = {
    code: req.body.code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  }

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, (err, response, token) => {
    console.log(token.refresh_token)
    const accessToken = token.access_token

    const headers = { Authorization: 'Bearer ' + accessToken }

    request.get({ url: peopleApiUrl, headers, json: true }, (err, response, profile) => {
      if (profile.error) {
        return res.status(500).send({ message: profile.error.message })
      }
      res.send({ token: accessToken, user: profile })
    })
  })
}

exports.authGoogleCallback = (req, res) => res.render('loading', { layout: false })
