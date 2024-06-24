import { Component, createEffect, Match, onMount, Switch } from 'solid-js';
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
    isLoading: boolean;
    hasError: boolean;
    img: HTMLImageElement | null;
}

const Img: Component<Props> = (props) => {
    const [state, setState] = createStore<State>({
        isLoading: true,
        hasError: false,
        img: null
    });

    const loadImage = async () => {
        try {
            const { src } = props;

            if (!src) {
                return;
            }

            console.log('load !');

            const img = new Image();

            img.src = props.src;

            if (!img.complete) {
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
            }
        } catch (e) {
            setState({ hasError: true });
        } finally {
            console.log('hey');
            setState({ isLoading: false });
        }
    };

    createEffect((currentSrc) => {
        const { src } = props;

        if (src !== currentSrc) {
            loadImage();
        }

        return src;
    }, props.src);

    onMount(() => {
        console.log('mount ?');
        loadImage();
    });

    return (
        <span
            class="block relative overflow-hidden"
            classList={{ [props.class || '']: !!props.class }}
        >
            <Transition name="fade">
                <Switch>
                    <Match
                        when={!props.src || state.isLoading || state.hasError}
                    >
                        <span class="absolute inset-0 flex items-center justify-center bg-primary-600">
                            <Icon
                                class="w-6 h-6 text-primary-100"
                                name="image"
                            />
                        </span>
                    </Match>

                    <Match when={!state.isLoading}>
                        <img
                            class="block overflow-hidden"
                            classList={{
                                [props.imgClass || '']: !!props.imgClass
                            }}
                            src={props.src}
                            alt={props.alt}
                        />
                    </Match>
                </Switch>
            </Transition>
        </span>
    );
};

export default Img;
