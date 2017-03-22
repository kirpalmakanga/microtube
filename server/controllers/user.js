const request = require('request')

const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token'
const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'

exports.auth = (req, res) => {
  const params = {
    code: req.body.code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  }

  request.post(accessTokenUrl, { json: true, form: params }, (err, response, token) => {
    const headers = { Authorization: 'Bearer ' + token.access_token }

    request.get({ url: peopleApiUrl, headers, json: true }, (err, response, profile) => {
      if (profile.error) {
        return res.status(500).send({ message: profile.error.message })
      }
      res.send({
        token: token.access_token,
        refresh: token.refresh_token,
        user: profile
      })
    })
  })
}

exports.authRefresh = (req, res) => {
  const params = {
    refresh_token: req.body.refresh_token,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'refresh_token'
  }

  request.post(accessTokenUrl, { json: true, form: params }, (err, response, token) => {
    const headers = { Authorization: 'Bearer ' + token.access_token }

    if (err) {
      return res.status(500).send({ message: err })
    }
    res.send({ token: token.access_token })
  })
}

exports.authCallback = (req, res) => res.render('loading', { layout: false })
