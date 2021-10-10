import { Component, Show } from 'solid-js';
import { stopPropagation } from '../../lib/helpers';
import { usePrompt } from '../../store/hooks/prompt';

import Icon from '../Icon';

import Button from '../Button';

import { ImportVideoForm } from './ImportVideoForm';
import PlaylistManager from './PlaylistManager';
import { Transition } from 'solid-transition-group';

const Prompt: Component = () => {
    const [
        { isVisible, mode, headerText, confirmText, cancelText, callback },
        { closePrompt }
    ] = usePrompt();

    const isMode = (...args: String[]) => args.includes(mode);

    const handleConfirm = (data?: unknown) => {
        closePrompt();

        callback(data);
    };

    let confirmButtonProps;

    switch (mode) {
        case 'import':
            confirmButtonProps = {
                type: 'submit',
                form: 'importVideos'
            };
            break;

        case 'playlists':
            confirmButtonProps = {
                onClick: closePrompt
            };
            break;

        default:
            confirmButtonProps = {
                onClick: handleConfirm
            };
            break;
    }

    return (
        <Transition name="fade">
            <Show when={isVisible}>
                <div className="dialog__overlay" onClick={closePrompt}>
                    <div
                        className="dialog shadow--2dp"
                        onClick={stopPropagation()}
                    >
                        <header className="dialog__header">
                            <Icon name="prompt" />

                            <span>{headerText}</span>
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
                            <Show when={cancelText}>
                                <Button
                                    className="button button--close shadow--2dp"
                                    onClick={closePrompt}
                                    title={cancelText}
                                />
                            </Show>

                            <Button
                                className="button shadow--2dp"
                                title={confirmText}
                                {...confirmButtonProps}
                            />
                        </footer>
                    </div>
                </div>
            </Show>
        </Transition>
    );
};

export default Prompt;
