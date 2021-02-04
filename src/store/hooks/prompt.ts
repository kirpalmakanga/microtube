import { te } from 'date-fns/locale';
import { useState, useCallback } from 'react';
import { useMergedState } from '../../lib/hooks';

export const initialState = {
    form: false,
    isVisible: false,
    promptText: '',
    confirmText: '',
    cancelText: 'Cancel',
    callback: () => {}
};
export const usePrompt = (initialState: PromptState) => {
    const [isVisible, setVisibility] = useState(false);
    const [state, setState] = useMergedState(initialState);

    const openPrompt = useCallback(() => setState({ isVisible: true }), [
        state
    ]);

    const closePrompt = useCallback(() => setState({ isVisible: false }), [
        state
    ]);

    return [{ openPrompt, closePrompt }];
};
