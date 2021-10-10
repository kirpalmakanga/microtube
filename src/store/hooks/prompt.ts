import { useStore } from '..';
import { GenericObject } from '../../../@types/alltypes';
import { delay } from '../../lib/helpers';

export const usePrompt = () => {
    const [{ prompt }, setState] = useStore();

    const openPrompt = (payload: GenericObject) =>
        setState('prompt', { ...payload, isVisible: true });

    const closePrompt = async () => {
        setState('prompt', {
            isVisible: false
        });

        await delay(300);

        setState('prompt', {
            isVisible: false,
            mode: '',
            headerText: '',
            confirmText: '',
            cancelText: '',
            callback: () => {}
        });
    };

    return [prompt, { openPrompt, closePrompt }];
};
