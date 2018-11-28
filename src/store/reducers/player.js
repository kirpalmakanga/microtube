import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    queue: [],
    currentIndex: -1,
    showQueue: false,
    showScreen: false,
    volume: 100,
    newQueueItems: 0,
    currentTime: 0
};

const setActiveItem = (index) => (item, i) =>
    updateObject(item, {
        active: i === index ? true : false
    });

const isActiveItem = (item) => item.active;

export default createReducer(initialState, {
    SCREEN_OPEN: (state) =>
        updateObject(state, {
            showScreen: true,
            showQueue: false
        }),

    SCREEN_CLOSE: (state) =>
        updateObject(state, {
            showScreen: false
        }),

    QUEUE_OPEN: (state) =>
        updateObject(state, {
            showQueue: true,
            showScreen: false,
            newQueueItems: 0
        }),

    QUEUE_CLOSE: (state) =>
        updateObject(state, {
            showQueue: false
        }),

    QUEUE_PUSH: (state, { data }) =>
        updateObject(state, {
            queue: [...state.queue, ...(Array.isArray(data) ? data : [data])],
            newQueueItems: (state.newQueueItems += Array.isArray(data)
                ? data.length
                : 1)
        }),

    QUEUE_REMOVE: (state, { data: index }) =>
        updateObject(state, {
            queue: state.queue.filter((item, i) => i !== index)
        }),

    QUEUE_CLEAR: (state) =>
        updateObject(state, {
            queue: state.queue.filter(isActiveItem)
        }),

    QUEUE_SET: (state, { data: queue }) =>
        updateObject(state, {
            queue
        }),

    QUEUE_SET_ACTIVE_ITEM: (state, { data: { index } = {} }) => {
        const { queue } = state;
        const currentIndex = index || queue.length - 1;

        return updateObject(state, {
            queue: queue.map(setActiveItem(currentIndex)),
            currentIndex
        });
    },

    SET_VOLUME: (state, { data }) =>
        updateObject(state, {
            volume: data
        }),

    SET_CURRENT_TIME: (state, { data }) =>
        updateObject(state, {
            currentTime: data
        })
});
