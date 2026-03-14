import { ParentComponent, Show } from 'solid-js';
import { stopPropagation } from '../../lib/helpers';

import Icon from '../Icon';
import Button from '../Button';

import { Transition } from 'solid-transition-group';
import { Portal } from 'solid-js/web';

interface Props {
    isVisible: boolean;
    contentClass?: string;
    title?: string;
    icon?: string;
    onClickClose: () => void;
}

const Modal: ParentComponent<Props> = (props) => {
    return (
        <Portal>
            <Transition name="fade">
                <Show when={props.isVisible}>
                    <div class="fixed inset-0 bg-primary-900 bg-opacity-50 cursor-pointer z-11"></div>
                </Show>
            </Transition>

            <Transition name="slide-up">
                <Show when={props.isVisible}>
                    <div
                        class="fixed inset-0 flex flex-col <md:justify-end md:(justify-center items-center) z-11 p-4"
                        onClick={props.onClickClose}
                    >
                        <div
                            class="bg-primary-900 shadow min-w-md max-w-full rounded p-4 relative"
                            onClick={stopPropagation()}
                        >
                            <Button
                                class="absolute top-4 right-4 flex justify-center items-center h-6 w-6 rounded bg-primary-800 hover:(bg-primary-700 scale-110 active:scale-90) transition"
                                icon="close"
                                onClick={props.onClickClose}
                            />

                            <header class="flex gap-4 mb-4 text-light-50">
                                <Show when={props.icon}>
                                    <Icon class="h-6 w-6" name="prompt" />
                                </Show>

                                <Show when={props.title}>
                                    <span class="flex-grow">{props.title}</span>
                                </Show>
                            </header>

                            {props.children}
                        </div>
                    </div>
                </Show>
            </Transition>
        </Portal>
    );
};

export default Modal;
