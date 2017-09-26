import thunk from 'redux-thunk'
import persistState from 'redux-localstorage'
import rootReducer from './reducers'

const { applyMiddleware, compose, createStore } = Redux

const enhancer = compose(
   applyMiddleware(thunk),
   persistState(['auth', 'player'], {
     key: 'ytlstate',
     slicer: paths => {
			 return ({ auth, player }) => {
         const { queue, currentIndex, volume } = player
         const { refresh, token, user } = auth

				 return {
					 auth: { refresh, token, user },
					 player: { queue, currentIndex, volume }
				 }
			 }
		 },
     merge: (initialState, storage) => {
				if (!storage) {
					return initialState
				}

	 	    return {
          ...initialState,
          auth: { ...initialState.auth, ...storage.auth },
          player: { ...initialState.player, ...storage.player }
        }
     }
   })
)

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  return store
}
