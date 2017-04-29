export default function updateState(actions, state, { type, data }) {
    const action = actions[type]
    return action ? Object.assign({}, state, action(data, state)) : state
}
