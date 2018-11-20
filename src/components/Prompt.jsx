import React, { Component } from 'react';
import { connect } from 'react-redux';
import { queueVideo } from '../actions/youtube';

import Button from './Button';

class Prompt extends Component {
    close = (e) => {
        const { dispatch } = this.props;

        if (e) {
            e.stopPropagation();
        }

        dispatch({ type: 'PROMPT_CLOSE' });
        setTimeout(() => dispatch({ type: 'PROMPT_RESET' }), 250);
    };

    handleSubmit = (e) => {
        const videoId = e.target.querySelector('input').value;

        e.preventDefault();

        this.props.dispatch(queueVideo(videoId));
        this.close();
    };

    render() {
        const {
            props: { prompt },
            close,
            handleSubmit
        } = this;
        const {
            form,
            isVisible,
            promptText,
            confirmText,
            cancelText,
            callback
        } = prompt;
        return (
            <div
                className={[
                    'dialog__overlay',
                    isVisible ? 'dialog__overlay--show' : ''
                ].join(' ')}
                onClick={close}
            >
                <div
                    className="dialog shadow--2dp"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="dialog__content">
                        <p>{promptText}</p>
                    </div>
                    {form ? (
                        <form onSubmit={handleSubmit}>
                            <div className="textfield">
                                <label labelfor="videoId">
                                    Video URL or ID
                                </label>
                                <input
                                    id="videoId"
                                    className="textfield__input"
                                    type="text"
                                    autoFocus
                                    placeholder="URL/ID..."
                                />
                            </div>
                            <div className="dialog__actions">
                                <Button
                                    className="button button--close shadow--2dp"
                                    onClick={close}
                                    title={cancelText}
                                />

                                <Button
                                    type="submit"
                                    className="button shadow--2dp"
                                    title={confirmText}
                                />
                            </div>
                        </form>
                    ) : (
                        <div className="dialog__actions">
                            <Button
                                className="button button--close shadow--2dp"
                                onClick={close}
                                title={cancelText}
                            />

                            <Button
                                className="button shadow--2dp"
                                onClick={callback}
                                title={confirmText}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ prompt }) => ({ prompt });

export default connect(mapStateToProps)(Prompt);
