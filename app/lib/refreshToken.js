export default function refreshToken(refreshToken, callback) {

  const interval = setInterval(() => {
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
  // }, 1000)
  }, 2700000)
  return interval
}
