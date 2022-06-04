import { Component, createSignal, onMount, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';
import Icon from './Icon';

interface Props {
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
        <span class="image">
            <Show
                when={img && img.complete}
                fallback={
                    <Transition name="fade">
                        <Show
                            when={state.isLoaded && !state.hasError}
                            fallback={
                                <span class="image__placeholder">
                                    <Icon name="image" />
                                </span>
                            }
                        >
                            <img src={props.src} alt={props.alt} />
                        </Show>
                    </Transition>
                }
            >
                <img src={props.src} alt={props.alt} />
            </Show>
        </span>
    );
};

export default Img;
