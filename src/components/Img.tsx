import { createSignal, Component, Show, createEffect } from 'solid-js';
import { Transition } from 'solid-transition-group';
import Icon from './Icon';

interface Props {
    src: string;
    alt?: string;
    background?: boolean;
}

const Img: Component<Props> = ({
    src = '',
    alt = 'image',
    background = false
}) => {
    const [isLoading, setLoadingStatus] = createSignal(true);

    createEffect(async () => {
        try {
            const img = new Image();
            img.src = src;

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
                <Show when={!isLoading()}>
                    {background ? (
                        <span
                            className="image__background"
                            style={{ backgroundImage: `url(${src})` }}
                        />
                    ) : (
                        <img src={src} alt={alt} />
                    )}
                </Show>
            </Transition>

            <Transition name="fade">
                <Show when={isLoading()}>
                    <span className="image__placeholder">
                        <Icon name="image" />
                    </span>
                </Show>
            </Transition>
        </span>
    );
};

export default Img;
