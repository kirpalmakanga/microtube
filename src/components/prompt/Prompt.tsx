import { Component, Match, Show, Switch } from 'solid-js';
import { stopPropagation } from '../../lib/helpers';
import { usePrompt } from '../../store/hooks/prompt';

import Icon from '../Icon';

import Button from '../Button';

import { ImportVideoForm } from './ImportVideoForm';
import PlaylistManager from './PlaylistManager';
import { Transition } from 'solid-transition-group';

const Prompt: Component = () => {
    const [prompt, { closePrompt }] = usePrompt();

    const isMode = (...args: String[]) => args.includes(prompt.mode);

    const handleConfirm = (data?: unknown) => {
        closePrompt();

        prompt.callback(data);
    };

    return (
        <Transition name="fade">
            <Show when={prompt.isVisible}>
                <div className="dialog__overlay" onClick={closePrompt}>
                    <div
                        className="dialog shadow--2dp"
                        onClick={stopPropagation()}
                    >
                        <header className="dialog__header">
                            <Icon name="prompt" />

                            <span>{prompt.headerText}</span>
                        </header>

                        <Show when={isMode('import', 'playlists')}>
                            <div className="dialog__content">
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

                        <footer className="dialog__actions">
                            <Show when={prompt.cancelText}>
                                <Button
                                    className="button is--close shadow--2dp"
                                    onClick={closePrompt}
                                    title={prompt.cancelText}
                                />
                            </Show>

                            <Show when={isMode('import')}>
                                <Button
                                    className="button shadow--2dp"
                                    title={prompt.confirmText}
                                    type="submit"
                                    form="importVideos"
                                />
                            </Show>

                            <Show when={isMode('default')}>
                                <Button
                                    className="button shadow--2dp"
                                    title={prompt.confirmText}
                                    onClick={handleConfirm}
                                />
                            </Show>
                        </footer>
                    </div>
                </div>
            </Show>
        </Transition>
    );
};

export default Prompt;
