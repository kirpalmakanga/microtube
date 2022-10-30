import { Component, createEffect, Match, Show, Switch } from 'solid-js';
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
            {state.isLoaded ? 'true' : 'false'}
            {state.img?.complete ? 'true' : 'false'}
            <Transition name="fade">
                <Switch>
                    <Match
                        when={
                            props.src && (state.img?.complete || state.isLoaded)
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
                    </Match>

                    <Match when={true}>
                        <span class="absolute inset-0 flex items-center justify-center bg-primary-600">
                            <Icon
                                class="w-6 h-6 text-primary-100"
                                name="image"
                            />
                        </span>
                    </Match>
                </Switch>
            </Transition>
        </span>
    );
};

export default Img;
