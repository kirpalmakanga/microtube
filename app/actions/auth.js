import url from 'url'
import qs from 'querystring'
import moment from 'moment'
import cookie from 'react-cookie'

function oauth2(config, dispatch) {
  return new Promise((resolve, reject) => {
    const params = {
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      display: 'popup',
      response_type: 'code'
    }
    const url = config.authorizationUrl + '?' + qs.stringify(params)
    resolve({ url, config, dispatch })
  })
}

function openPopup({ url, config, dispatch }) {
  return new Promise((resolve, reject) => {
    const width = config.width || 500
    const height = config.height || 500
    const options = {
      width: width,
      height: height,
      top: window.screenY + ((window.outerHeight - height) / 2.5),
      left: window.screenX + ((window.outerWidth - width) / 2)
    }
    const popup = window.open(url, '_blank', qs.stringify(options, ','))

    if (url === 'about:blank') {
      popup.document.body.innerHTML = 'Loading...'
    }

    resolve({ window: popup, config, dispatch })
  })
}

function getRequestToken({ window, config, dispatch }) {
  return new Promise((resolve, reject) => {
    return fetch(config.url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        redirectUri: config.redirectUri
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          resolve({ window, config, requestToken: json, dispatch })
        })
      }
    })
  })
}

function pollPopup({ window, config, requestToken, dispatch }) {
  return new Promise((resolve, reject) => {
    const redirectUri = url.parse(config.redirectUri)
    const redirectUriPath = redirectUri.host + redirectUri.pathname

    if (requestToken) {
      window.location = config.authorizationUrl + '?' + qs.stringify(requestToken)
    }

    const polling = setInterval(() => {
      if (!window || window.closed) {
        clearInterval(polling)
      }
      try {
        const popupUrlPath = window.location.host + window.location.pathname
        if (popupUrlPath === redirectUriPath) {
          if (window.location.search || window.location.hash) {
            const query = qs.parse(window.location.search.substring(1).replace(/\/$/, ''))
            const hash = qs.parse(window.location.hash.substring(1).replace(/[\/$]/, ''))
            const params = Object.assign({}, query, hash)

            if (params.error) {
              dispatch({
                type: 'OAUTH_FAILURE',
                notification: params.error
              })
            } else {
              resolve({ oauthData: params, config, window, interval: polling, dispatch })
            }
          } else {
            dispatch({
              type: 'OAUTH_FAILURE',
              notification: 'OAuth redirect has occurred but no query or hash parameters were found.'
            })
          }
        }
      } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in Internet Explorer.
      }
    }, 500)
  })
}

function exchangeCodeForToken({ oauthData, config, window, interval, dispatch }) {
  return new Promise((resolve, reject) => {
    const data = Object.assign({}, oauthData, config)

    console.log('oauthData', oauthData)

    return fetch(config.url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin', // By default, fetch won't send any cookies to the server
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.ok) {
        response.json()
        .then(({ token, user }) => resolve({ token, user, window, interval, dispatch }))
      } else {
        response.json().then((json) => {
          dispatch({
            type: 'OAUTH_FAILURE',
            notification: json.message
          })
          closePopup({ window, interval })
        })
      }
    })
  })
}

function signIn({ token, user, window, interval, dispatch }) {
  // const { displayName, email, photoURL, uid } = user
  return new Promise((resolve, reject) => {
    cookie.save('ytltoken', token, { expires: moment().add(1, 'hour').toDate() })

    dispatch({
      type: 'OAUTH_SUCCESS',
      token,
      user
    })

    resolve({ window, interval })
  })
}

function closePopup({ window, interval }) {
  return new Promise((resolve, reject) => {
    clearInterval(interval)
    window.close()
    resolve()
  })
}

// Sign in with Google
export function logIn() {
  const google = {
    url: window.location.origin + '/auth',
    clientId: '440745412600-snpeajuh0l9tqfrt356mec6j3mdn8eoo.apps.googleusercontent.com',
    redirectUri: window.location.origin + '/auth/callback',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
    scope: 'openid profile email https://www.googleapis.com/auth/youtube',
    width: 440,
    height: 540
  }

  return dispatch => {
    oauth2(google, dispatch)
      .then(openPopup)
      .then(pollPopup)
      .then(exchangeCodeForToken)
      .then(signIn)
      .then(closePopup)
  }
}
