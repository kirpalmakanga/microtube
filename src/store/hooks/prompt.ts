import { useState, useCallback } from 'react';
import { GenericObject } from '../../..';
import { useMergedState } from '../../lib/hooks';

interface PromptState {
    isVisible: boolean;
    headerText: string;
    confirmText: string;
    cancelText: string;
    callback: (...args: unknown[]) => void;
}

export const initialState: PromptState = {
    isVisible: false,
    headerText: '',
    confirmText: '',
    cancelText: '',
    callback: () => {}
};
export const usePrompt = () => {
    const [state, setState] = useMergedState(initialState);

    const openPrompt = useCallback(
        (data: GenericObject) => setState({ ...data, isVisible: true }),
        [state]
    );

    const closePrompt = useCallback(() => setState({ isVisible: false }), [
        state
    ]);

    return [state, { openPrompt, closePrompt }];
};
