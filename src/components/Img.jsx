import React, { Component } from 'react';
import Fade from './animations/Fade';

class Img extends Component {
    static defaultProps = {
        src: '',
        alt: 'image',
        background: false
    };

    state = {
        isLoading: false
    };

    transition = {
        transition: 'opacity 0.3s ease-out'
    };

    loadImage = async () => {
        const {
            props: { src: url }
        } = this;

        if (!url) {
            return;
        }

        try {
            const img = new Image();
            img.src = url;

            if (img.complete) {
                return;
            }

            this.setState({ isLoading: true });

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
        } catch (e) {
            console.error(e);
        } finally {
            if (this.unmounting) {
                return;
            }

            this.setState({ url, isLoading: false });
        }
    };

    componentDidMount = () => {
        this.loadImage();
    };

    componentWillUnmount() {
        this.unmounting = true;
    }

    render() {
        const {
            props: { src, alt, background },
            state: { isLoading }
        } = this;

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
    }
}

export default Img;
