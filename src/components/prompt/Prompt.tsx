import { Component, Show } from 'solid-js';
import { usePrompt } from '../../store/prompt';

import Button from '../Button';

import Modal from '../ui/Modal';

const Prompt: Component = () => {
    const [prompt, { closePrompt }] = usePrompt();

    const handleConfirm = (data?: unknown) => {
        closePrompt();

        prompt.callback(data);
    };

    return (
        <Modal title={prompt.headerText} isVisible={prompt.isVisible} onClickClose={closePrompt}>
            <footer class="flex justify-end gap-4 mt-4">
                <Show when={prompt.cancelText}>
                    <Button
                        class="flex items-center justify-center gap-2 px-4 py-1 bg-red-500 hover:bg-red-400 transition-colors text-light-50 font-montserrat rounded shadow"
                        onClick={closePrompt}
                        title={prompt.cancelText}
                    />
                </Show>

                <Button
                    class="flex items-center justify-center gap-2 px-4 py-1 bg-violet-500 hover:bg-violet-400 transition-colors text-light-50 font-montserrat rounded shadow"
                    title={prompt.confirmText}
                    onClick={handleConfirm}
                />
            </footer>
        </Modal>
    );
};

export default Prompt;
