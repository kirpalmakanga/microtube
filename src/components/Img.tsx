import { Component, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';
import Icon from './Icon';

interface Props {
    class?: string;
    imgClass?: string;
    src: string;
    alt?: string;
    background?: boolean;
}

const Img: Component<Props> = (props) => {
    const [state, setState] = createStore({
        isLoaded: false,
        hasError: false
    });

    let img;

    if (props.src) {
        img = new Image();
        img.src = props.src;
    }

    if (img && !img.complete) {
        img.onload = () => setState({ isLoaded: true });
        img.onerror = () => setState({ hasError: true });
    }

    return (
        <span
            class="block relative overflow-hidden"
            classList={{ [props.class || '']: !!props.class }}
        >
            <Show
                when={img && img.complete}
                fallback={
                    <Transition name="fade">
                        <Show
                            when={state.isLoaded && !state.hasError}
                            fallback={
                                <span class="absolute inset-0 flex items-center justify-center bg-primary-600">
                                    <Icon
                                        class="w-6 h-6 text-primary-100"
                                        name="image"
                                    />
                                </span>
                            }
                        >
                            <img
                                class="block overflow-hidden"
                                classList={{
                                    [props.imgClass || '']: !!props.imgClass
                                }}
                                src={props.src}
                                alt={props.alt}
                            />
                        </Show>
                    </Transition>
                }
            >
                <img
                    classList={{
                        [props.imgClass || '']: !!props.imgClass
                    }}
                    src={props.src}
                    alt={props.alt}
                />
            </Show>
        </span>
    );
};

export default Img;
