export default function updateState(actions, initialState) {
  return (state = initialState, { type, data }) => {
    const action = actions[type]
    console.log(type, data)
    return action ? Object.assign({}, state, action(data, state)) : state
  }
}
