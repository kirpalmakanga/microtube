import { useCallback } from 'react';
import { useStore } from '..';
import { GenericObject } from '../../../@types/alltypes';
import { delay } from '../../lib/helpers';

export const usePrompt = () => {
    const [{ prompt }, dispatch] = useStore();

    const openPrompt = useCallback(
        (payload: GenericObject) =>
            dispatch({
                type: 'prompt/OPEN',
                payload
            }),
        [prompt]
    );

    const closePrompt = useCallback(async () => {
        dispatch({
            type: 'prompt/CLOSE'
        });

        await delay(300), dispatch({ type: 'prompt/RESET' });
    }, [prompt]);

    return [prompt, { openPrompt, closePrompt }];
};
