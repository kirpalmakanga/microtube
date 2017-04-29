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
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
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

    resolve({ popup, config, dispatch })
  })
}

function getRequestToken({ popup, config, dispatch }) {
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
          resolve({ popup, config, requestToken: json, dispatch })
        })
      }
    })
  })
}

function pollPopup({ popup, config, requestToken, dispatch }) {
  return new Promise((resolve, reject) => {
    const redirectUri = url.parse(config.redirectUri)
    const redirectUriPath = redirectUri.host + redirectUri.pathname

    if (requestToken) {
      popup.location = config.authorizationUrl + '?' + qs.stringify(requestToken)
    }

    const polling = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(polling)
      }
      try {
        const popupUrlPath = popup.location.host + popup.location.pathname
        if (popupUrlPath === redirectUriPath) {
          if (popup.location.search || popup.location.hash) {
            const query = qs.parse(popup.location.search.substring(1).replace(/\/$/, ''))
            const hash = qs.parse(popup.location.hash.substring(1).replace(/[\/$]/, ''))
            const params = Object.assign({}, query, hash)

            if (params.error) {
              dispatch({ type: 'NOTIFY', data: params.error })
            } else {
              resolve({ oauthData: params, config, popup, interval: polling, dispatch })
            }
          } else {
            dispatch({ type: 'NOTIFY', data: 'OAuth redirect has occurred but no query or hash parameters were found.' })
          }
        }
      } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in Internet Explorer.
      }
    }, 500)
  })
}

function exchangeCodeForToken({ oauthData, config, popup, interval, dispatch }) {
  return new Promise((resolve, reject) => {
    const data = Object.assign({}, oauthData, config)

    return fetch(config.url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin', // By default, fetch won't send any cookies to the server
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.ok) {
        response.json()
        .then(({ token, refresh, user }) => resolve({ token, refresh, user, popup, interval, dispatch }))
      } else {
        response.json().then((json) => {
          dispatch({ type: 'NOTIFY', data: json.message })

          closePopup({ popup, interval })
        })
      }
    })
  })
}

export function refreshAccessToken(refreshToken, callback) {
  fetch(window.location.origin + '/auth/refresh', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', // By default, fetch won't send any cookies to the server
    body: JSON.stringify({ refresh_token: refreshToken })
  })
  .then(response => {
    if (response.ok) {
      response.json().then(({ token }) => callback(token))
    }
  })
}

function signIn({ token, refresh, user, popup, interval, dispatch }) {
  return new Promise((resolve, reject) => {
    const getExpirationDate = () => moment().add(1, 'hours').toDate()
    const setCookie = () => cookie.save('ytltoken', token, { expires: getExpirationDate() })

    const refreshWatcher = setInterval(() => {
      refreshAccessToken(refresh, token => {
        setCookie()
        dispatch({ type: 'OAUTH_REFRESH', data: token })
      })
    // }, 10000)
    }, 3540000)

    setCookie()

    dispatch({ type: 'OAUTH_SUCCESS', data: { token, user, refreshWatcher } })

    resolve({ popup, interval })
  })
}

function closePopup({ popup, interval }) {
  return new Promise((resolve, reject) => {
    clearInterval(interval)
    popup.close()
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
