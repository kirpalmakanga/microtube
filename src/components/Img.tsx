import { useState, useEffect, FunctionComponent } from 'react';
import Fade from './animations/Fade';
import Icon from './Icon';

interface Props {
    src: string;
    alt: string;
    background?: boolean;
}

const Img: FunctionComponent<Props> = ({
    src = '',
    alt = 'image',
    background = false
}) => {
    const [isLoading, setLoadingStatus] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const img = new Image();
                img.src = src;

                if (!img.complete) {
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                    });
                }
            } catch (e) {
            } finally {
                setLoadingStatus(false);
            }
        })();
    }, [src]);

    return (
        <span className="image">
            <Fade in={isLoading} duration={300}>
                <span className="image__placeholder">
                    <Icon name="image" />
                </span>
            </Fade>
            <Fade in={!isLoading} duration={300}>
                {background ? (
                    <span
                        className="image__background"
                        style={{ backgroundImage: `url(${src})` }}
                    />
                ) : (
                    <img src={src} alt={alt} />
                )}
            </Fade>
        </span>
    );
};

export default Img;
