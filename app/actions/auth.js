// jshint esversion: 6, asi: true
// eslint-env es6

import firebase from 'firebase'
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
