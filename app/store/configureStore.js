import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import rootReducer from '../reducers'

const { applyMiddleware, compose, createStore } = Redux

const enhancer = compose(
   applyMiddleware(thunk),
   persistState(['auth', 'player'], {
     key: 'ytlstate',
     slicer: paths => {
			 return ({ auth, player }) => {
				 return {
					 auth,
					 player: {
						 queue: player.queue,
						 video: player.video
					 }
				 }
			 }
		 },
     merge: (initialState, storage) => {
				if (!storage) {
					return initialState
				}

	 	    return Object.assign({}, initialState, {
	 	        auth: Object.assign({}, initialState.auth, storage.auth),
	 	        player: Object.assign({}, initialState.player, storage.player)
	 	    })
     }
   })
)

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  return store
}
