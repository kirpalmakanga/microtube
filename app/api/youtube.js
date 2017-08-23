function loadApi() {
  return new Promise((resolve, reject) => {
    const waitForAPI = setInterval(() => {
      if(gapi && gapi.client) {
        clearInterval(waitForAPI)
        gapi.client.load('youtube', 'v3', () => resolve(gapi.client.youtube))
      }
    }, 100)
  })
}

function parseID(url){
  var ID = ''

  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)

  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i)
    ID = ID[0]
  }
  else {
    ID = url.toString()
  }
  return ID
}

function list(field, config) {
  return new Promise((resolve, reject) => {
    loadApi()
    .then(youtube => {
      youtube[field].list(config).execute(res => res.error ? reject(res.message) : resolve(res))
    })
    .catch(err => reject(err))
  })
}

function remove(field, config) {
  return new Promise((resolve, reject) => {
    loadApi()
    .then(youtube => {
      youtube[field].delete(config).execute(res => res.error ? reject(res.message) : resolve(res))
    })
    .catch(err => reject(err))
  })
}
