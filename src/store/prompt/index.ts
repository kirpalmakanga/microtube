import { useStore } from '..';
import { delay } from '../../lib/helpers';
import { initialState, PromptState } from './_state';

export const usePrompt = () => {
    const [{ prompt }, setState] = useStore();

    const openPrompt = (payload: Partial<PromptState>) =>
        setState('prompt', { ...payload, isVisible: true });

    const closePrompt = async () => {
        setState('prompt', {
            isVisible: false
        });

        await delay(300);

        setState('prompt', initialState());
    };

    return [prompt, { openPrompt, closePrompt }] as const;
};
