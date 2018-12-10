import React, { Component } from 'react';
import { connect } from 'react-redux';

import Fade from './animations/Fade';

import Icon from './Icon';

import Button from './Button';

import { delay } from '../lib/helpers';

class ImportVideoForm extends Component {
    state = {
        data: { text: '' }
    };

    handleChange = ({ target: { name, value } }) =>
        this.setState(({ data }) => ({ data: { ...data, [name]: value } }));

    handleSubmit = (e) => {
        e.preventDefault();

        const {
            data: { text }
        } = this.state;

        this.props.onSubmit(text);
    };

    render() {
        const {
            state: { text },
            props: { onClickCancel, cancelText, submitText },
            handleChange,
            handleSubmit
        } = this;

        return (
            <form onSubmit={handleSubmit}>
                <div className="textfield">
                    <textarea
                        id="videoId"
                        className="textfield__input"
                        type="text"
                        name="text"
                        value={text}
                        onChange={handleChange}
                        autoFocus
                        placeholder="URLs/IDs..."
                    />
                </div>
                <div className="dialog__actions">
                    <Button
                        className="button button--close shadow--2dp"
                        onClick={onClickCancel}
                        title={cancelText}
                    />

                    <Button
                        type="submit"
                        className="button shadow--2dp"
                        title={submitText}
                    />
                </div>
            </form>
        );
    }
}

class PlaylistManager extends Component {
    handleClick = ({ target: { name, checked } }) =>
        this.props.onClickItem(name, checked ? 'insert' : 'remove');

    render() {
        const {
            props: { items },
            handleClick
        } = this;

        return (
            <div className="playlist-menu">
                {items.map(({ id, title }) => (
                    <label
                        className="playlist-menu__item"
                        key={id}
                        htmlFor={id}
                        onClick={handleClick}
                    >
                        {/* TODO: Ajouter un <Icon></Icon>, ajouter les checkbox au sprite */}

                        <span className="playlist-menu__item-text">
                            {title}
                        </span>
                        <Icon name="add" />
                    </label>
                ))}
            </div>
        );
    }
}

class Prompt extends Component {
    state = {
        playlistActions: new Map()
    };

    close = async (e) => {
        if (e) {
            e.stopPropagation();
        }

        this.props.closePrompt();
    };

    render() {
        const {
            props: {
                prompt: {
                    form,
                    playlists = [],
                    isVisible,
                    promptText,
                    confirmText,
                    cancelText,
                    callback
                }
            },
            close
        } = this;

        return (
            <Fade className="dialog__overlay" onClick={close} in={isVisible}>
                <div
                    className="dialog shadow--2dp"
                    onClick={(e) => e.stopPropagation()}
                >
                    <header className="dialog__header">
                        <Icon name="prompt" />
                        {promptText}
                    </header>

                    {form ? (
                        <div className="dialog__content">
                            <ImportVideoForm
                                onClickCancel={close}
                                onSubmit={callback}
                                cancelText={cancelText}
                                submitText={confirmText}
                            />
                        </div>
                    ) : playlists.length ? (
                        <div className="dialog__content">
                            <PlaylistManager
                                items={playlists}
                                onClickItem={callback}
                            />{' '}
                        </div>
                    ) : null}

                    {!form && (
                        <footer className="dialog__actions">
                            <Button
                                className="button button--close shadow--2dp"
                                onClick={close}
                                title={cancelText}
                            />
                            <Button
                                className="button shadow--2dp"
                                onClick={playlists.length ? close : callback}
                                title={confirmText}
                            />
                        </footer>
                    )}
                </div>
            </Fade>
        );
    }
}

const mapStateToProps = ({ prompt }) => ({ prompt });

const mapDispatchToProps = (dispatch) => ({
    closePrompt: async () => {
        dispatch({ type: 'prompt/CLOSE' });

        await delay(300);

        dispatch({ type: 'prompt/RESET' });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Prompt);
