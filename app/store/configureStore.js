// jshint esversion: 6, asi: true
// eslint-env es6

import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import rootReducer from '../reducers'

const { applyMiddleware, compose, createStore } = Redux

const hasStorage = (() => {
	var uid = new Date
	var storage
	var result
	try {
		(storage = window.localStorage).setItem(uid, uid)
		result = storage.getItem(uid) == uid
		storage.removeItem(uid)
		return result && storage
	} catch (exception) {}
})()

const enhancer = compose(
   applyMiddleware(thunk),
   hasStorage ? persistState(['auth', 'player'], {
     key: 'ytlstate',
     slicer: paths => ({ auth, player }) => ({ auth, queue: player.queue }),
     merge: (initialState, storage) => {
			 const auth = storage && storage.auth ? storage.auth : initialState.auth
			 const queue = storage && storage.queue ? storage.queue : initialState.player.queue

       const player = Object.assign({}, initialState.player, { queue })

       return Object.assign({}, initialState, { auth, player })
     }
   }) : state => state
)

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  return store
}
