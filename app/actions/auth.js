// jshint esversion: 6, asi: true
// eslint-env es6

import firebase from 'firebase'
import cookie from 'react-cookie'

const app = firebase.initializeApp({
  apiKey: 'AIzaSyCLDBo0aNwTTOp6yQMaD9b4mQX4B_rT2NE',
  authDomain: 'youtube-lite-react.firebaseapp.com',
  databaseURL: 'https://youtube-lite-react.firebaseio.com',
  storageBucket: 'youtube-lite-react.appspot.com',
  messagingSenderId: '440745412600'
})

const provider = new firebase.auth.GoogleAuthProvider()

provider.addScope('https://www.googleapis.com/auth/youtube')

exports.logIn = () => {
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
    }).catch(({ message }) => {
      dispatch({
        type: 'OAUTH_FAILURE',
        notification: message
      })
    })
  }
}
