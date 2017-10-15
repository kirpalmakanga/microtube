function isClientReady() {
    return !!gapi.auth2
}

export function waitForAPI() {
  return new Promise((resolve) => {
    const waitForAuth = setInterval(() => {
      if(gapi) {
        resolve()
      }
    }, 200)
  })
}

export function initClient() {
    return gapi.client.init({
      clientId: '440745412600-snpeajuh0l9tqfrt356mec6j3mdn8eoo.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/youtube'
    })
}

export function signIn() {
  if (isClientReady()) {
    gapi.auth2.getAuthInstance().signIn()
  }
}

export function signOut() {
  if (isClientReady()) {
    gapi.auth2.getAuthInstance().signOut()
  }
}

export function getAuthInstance() {
  return gapi.auth2.getAuthInstance()
}

export function listenAuthStateChange(callback) {
  const GoogleAuth = getAuthInstance()

  GoogleAuth.isSignedIn.listen(callback)
}
