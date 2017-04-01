export default function updateState(mutations, state, { type, data }) {
    const mutation = mutations[type]
    return mutation ? mutation(state, data) : state
}
