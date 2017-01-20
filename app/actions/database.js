// jshint esversion: 6, asi: true
// eslint-env es6

import firebase from 'firebase'

import api from '../api/database.js'

const app = firebase.initializeApp({
  apiKey: 'AIzaSyCLDBo0aNwTTOp6yQMaD9b4mQX4B_rT2NE',
  authDomain: 'youtube-lite-react.firebaseapp.com',
  databaseURL: 'https://youtube-lite-react.firebaseio.com',
  storageBucket: 'youtube-lite-react.appspot.com',
  messagingSenderId: '440745412600'
})

const database = app.database()

const provider = new firebase.auth.GoogleAuthProvider()

provider.addScope('https://www.googleapis.com/auth/youtube')

export function logIn() {
  return dispatch => {
    app.auth().signInWithPopup(provider).then(({ credential, user }) => {
      const { displayName, email, photoURL, uid } = user
      dispatch({
        type: 'OAUTH_SUCCESS',
        token: credential.accessToken,
        user: {
          uid,
          displayName,
          email,
          photoURL
        }
      })
    }).catch(({ code, message, email, credential }) => {
      dispatch({
        type: 'OAUTH_FAILURE',
        notification: message
      })
    })
  }
}

export function getPlaylists (accessToken) {
  return dispatch => {
    dispatch({ type: 'GET_PLAYLISTS' })
    const getItems = nextPage => {
      api.getPlaylists(accessToken, nextPage)
      .then(data => {
        const { nextPageToken } = data

        dispatch({
          type: 'GET_PLAYLISTS_SUCCESS',
          data
        })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => console.error(err))
    }
    getItems()
  }
}

export function getPlaylistItems (accessToken, playlistId, play) {
  return dispatch => {
    const getItems = (nextPage) => {
      api.getPlaylistItems(accessToken, playlistId, nextPage)
      .then(data => {
        const { items, nextPageToken } = data

        if (play && !nextPage && items.length > 0) {
          dispatch({
            type: 'PLAY',
            data: items[0],
            skip: true
          })
        }

        dispatch({
          type: 'QUEUE_PUSH_PLAYLIST',
          playlistId,
          data: items
        })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => console.error(err))
    }
    getItems()
  }
}

export function searchVideos (accessToken, query, pageToken) {
  console.log('query', query)
  return dispatch => {
    dispatch({
      type: 'SEARCH_VIDEOS',
      query
    })
    api.searchVideos(accessToken, query, pageToken)
    .then(data => {
      dispatch({
        type: 'SEARCH_VIDEOS_SUCCESS',
        data
      })
    })
    .catch(err => console.error(err))
  }
}
