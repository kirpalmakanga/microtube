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

    onMount(async () => {
        try {
            const img = new Image();
            img.src = props.src;

            if (!img.complete) {
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
            }
        } finally {
            setLoadingStatus(false);
        }
    });

    return (
        <span className="image">
            <Transition name="fade">
                <Show
                    when={!isLoading()}
                    fallback={
                        <span className="image__placeholder">
                            <Icon name="image" />
                        </span>
                    }
                >
                    {props.background ? (
                        <span
                            className="image__background"
                            style={{ 'background-image': `url(${props.src})` }}
                        />
                    ) : (
                        <img src={props.src} alt={props.alt} />
                    )}
                </Show>
            </Transition>
        </span>
    );
};

export default Img;
