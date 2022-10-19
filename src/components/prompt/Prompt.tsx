import { Component, Show } from 'solid-js';
import { stopPropagation } from '../../lib/helpers';
import { usePrompt } from '../../store/prompt';

import Icon from '../Icon';

import Button from '../Button';

import { ImportVideoForm } from './ImportVideoForm';
import PlaylistManager from './PlaylistManager';
import { Transition } from 'solid-transition-group';

const Prompt: Component = () => {
    const [prompt, { closePrompt }] = usePrompt();

    const isMode = (...args: string[]) => args.includes(prompt.mode);

    const handleConfirm = (data?: unknown) => {
        closePrompt();

        prompt.callback(data);
    };

    return (
        <>
            <Transition name="fade">
                <Show when={prompt.isVisible}>
                    <div
                        class="fixed inset-0 bg-primary-900 bg-opacity-50 cursor-pointer z-11"
                        onClick={closePrompt}
                    ></div>
                </Show>
            </Transition>

            <Transition name="slide-up">
                <Show when={prompt.isVisible}>
                    <div
                        class="fixed bottom-0 left-0 right-0 bg-primary-900 shadow z-11"
                        onClick={stopPropagation()}
                    >
                        <header class="flex gap-4 p-4 text-light-50 border-b-1 border-primary-700">
                            <Icon class="h-6 w-6" name="prompt" />

                            <span>{prompt.headerText}</span>
                        </header>

                        <Show when={isMode('import', 'playlists')}>
                            <div class="flex flex-col flex-grow overflow-y-auto border-b-1 border-primary-700">
                                <Show when={isMode('import')}>
                                    <ImportVideoForm onSubmit={handleConfirm} />
                                </Show>

                                <Show when={isMode('playlists')}>
                                    <PlaylistManager
                                        onClickItem={handleConfirm}
                                    />
                                </Show>
                            </div>
                        </Show>

                        <footer class="flex justify-end gap-4 p-4">
                            <Show when={prompt.cancelText}>
                                <Button
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-400 transition-colors font-bold text-light-50 shadow"
                                    onClick={closePrompt}
                                    title={prompt.cancelText}
                                />
                            </Show>

                            <Show when={isMode('import')}>
                                <Button
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-primary-800 hover:bg-primary-700 transition-colors font-bold text-light-50 shadow"
                                    title={prompt.confirmText}
                                    type="submit"
                                    form="importVideos"
                                />
                            </Show>

                            <Show when={isMode('default')}>
                                <Button
                                    class="flex items-center justify-center gap-2 px-4 py-2 bg-primary-800 hover:bg-primary-700 transition-colors font-bold text-light-50 shadow"
                                    title={prompt.confirmText}
                                    onClick={handleConfirm}
                                />
                            </Show>
                        </footer>
                    </div>
                </Show>
            </Transition>
        </>
    );
};

export default Prompt;
