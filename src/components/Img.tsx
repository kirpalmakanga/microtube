import { Component, createSignal, onMount, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import Icon from './Icon';

interface Props {
    src: string;
    alt?: string;
    background?: boolean;
}

const Img: Component<Props> = (props) => {
    const [isLoading, setLoadingStatus] = createSignal(true);
    const onImageLoaded = () => setLoadingStatus(false);

    const img = new Image();
    img.src = props.src;

    if (!img.complete) {
        img.onload = onImageLoaded;
        img.onerror = onImageLoaded;
    }

    return (
        <span className="image">
            <Show
                when={img.complete}
                fallback={
                    <Transition name="fade">
                        <Show
                            when={!isLoading()}
                            fallback={
                                <span className="image__placeholder">
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
