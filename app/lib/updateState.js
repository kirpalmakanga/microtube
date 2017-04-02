export default function updateState(actions, state, { type, data }) {
    const action = actions[type]
    return action ? action(state, data) : state
}
