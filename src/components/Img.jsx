import React, { Component } from 'react';
import Fade from './animations/Fade';

class Img extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: '',
            isLoading: true
        };
    }

    shouldComponentUpdate({ src }) {
        const { url } = this.state;
        return src !== url;
    }

    componentDidUpdate() {
        this.loadImage();
    }

    loadImage = async () => {
        const {
            props: { src: url = '' }
        } = this;

        if (!url) {
            return;
        }

        try {
            await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
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
            props: { src, alt = 'image', background },
            state: { url, isLoading }
        } = this;

        return (
            <figure className="image">
                <Fade in={!isLoading}>
                    {background ? (
                        <div
                            className="image__background"
                            style={{ backgroundImage: `url(${src})` }}
                        />
                    ) : (
                        <img src={url} alt={alt} />
                    )}
                </Fade>

                <Fade in={isLoading}>
                    <span className="image__loader">
                        <svg className="rotating">
                            <use xlinkHref="#icon-loading" />
                        </svg>
                    </span>
                </Fade>
            </figure>
        );
    }
}

export default Img;
