import { Component, createEffect, Show } from 'solid-js';
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

interface State {
    isLoaded: boolean;
    hasError: boolean;
    img: HTMLImageElement | null;
}

const Img: Component<Props> = (props) => {
    const [state, setState] = createStore<State>({
        isLoaded: false,
        hasError: false,
        img: null
    });

    createEffect((currentSrc) => {
        const { src } = props;

        if (src && src !== currentSrc) {
            const img = new Image();

            img.onload = () => setState({ isLoaded: true });
            img.onerror = () => setState({ hasError: true });

            img.src = src;

            setState('img', img);
        }

        return src;
    });

    return (
        <span
            class="block relative overflow-hidden"
            classList={{ [props.class || '']: !!props.class }}
        >
            <Show
                when={state.img?.complete}
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
