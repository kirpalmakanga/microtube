// jshint esversion: 6, asi: true
// eslint-env es6

import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import rootReducer from '../reducers'

const { applyMiddleware, compose, createStore } = Redux

const hasStorage = (() => {
	const uid = new Date
	let storage
	let result
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
     slicer: paths => ({ auth, player }) => {
			 return {
				 auth,
				 player: { queue: player.queue }
			 }
		 },
     merge: (initialState, storage) => {
			if (!storage) {
			    return initialState
			}
			
	    return Object.assign({}, initialState, {
	        auth: storage.auth || initialState.auth,
	        player: Object.assign({}, initialState.player, storage.player || initialState.player)
	    })
     }
   }) : state => state
)

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  return store
}
