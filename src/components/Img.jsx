import { useState, useEffect } from 'react';
import Fade from './animations/Fade';

const Img = ({ src = '', alt = 'image', background = false }) => {
    const [isLoading, setLoadingStatus] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                if (src) {
                    const img = new Image();
                    img.src = src;

                    if (!img.complete) {
                        await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                        });
                    }
                }
            } catch (e) {
            } finally {
                setLoadingStatus(false);
            }
        })();
    }, [src]);

    return (
        <figure className="image">
            <Fade in={!isLoading} duration={300}>
                {background ? (
                    <div
                        className="image__background"
                        style={{ backgroundImage: `url(${src})` }}
                    />
                ) : (
                    <img src={src} alt={alt} />
                )}
            </Fade>
        </figure>
    );
};

export default Img;
