import { useStore } from '..';
import { delay } from '../../lib/helpers';
import { initialState, PromptState } from '../state/_prompt';

export const usePrompt = () => {
    const [{ prompt }, setState] = useStore();

    const openPrompt = (payload: PromptState) =>
        setState('prompt', { ...payload, isVisible: true });

    const closePrompt = async () => {
        setState('prompt', {
            isVisible: false
        });

        await delay(300);

        setState('prompt', initialState());
    };

    return [prompt, { openPrompt, closePrompt }];
};
