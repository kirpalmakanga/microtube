import { delay } from '../lib/helpers';

export const closePrompt = () => async (dispatch) => {
    dispatch({ type: 'prompt/CLOSE' });

    await delay(300);

    dispatch({ type: 'prompt/RESET' });
};

export const prompt = (config = {}, callback = async () => {}) => (dispatch) =>
    dispatch({
        type: 'prompt/OPEN',
        data: {
            ...config,
            callback: async (data) => {
                await callback(data);

                dispatch(closePrompt());
            }
        }
    });
