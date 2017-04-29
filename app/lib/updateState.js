export default function updateState(actions, initialState) {
  return (state = initialState, { type, data }) => {
    const action = actions[type]
    return action ? Object.assign({}, state, action(data, state)) : state
  }
}
