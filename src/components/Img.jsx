import React, { Component } from 'react';
import Fade from './animations/Fade';

class Img extends Component {
    static defaultProps = {
        src: ''
    };

    state = {
        url: '',
        isLoading: false
    };

    transition = {
        transition: 'opacity 0.3s ease-out'
    };

    loadImage = async () => {
        const {
            props: { src: url = '' }
        } = this;

        if (!url) {
            return;
        }

        console.log('loadImage');

        try {
            const img = new Image();
            img.src = url;

            if (img.complete) {
                console.log('complete');
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
        this.img = new this.loadImage();
    };

    componentWillUnmount() {
        this.unmounting = true;
    }

    render() {
        const {
            props: { src, alt = 'image', background },
            state: { url, isLoading }
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
                        <img src={url} alt={alt} />
                    )}
                </Fade>
            </figure>
        );
    }
}

export default Img;
