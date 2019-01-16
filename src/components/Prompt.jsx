import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getPlaylists } from '../actions/youtube';

import Fade from './animations/Fade';

import Icon from './Icon';

import Button from './Button';
import DropDown from './DropDown';

import Grid from './Grid';

import { delay, stopPropagation } from '../lib/helpers';

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
            props: { id = '' },
            handleChange,
            handleSubmit
        } = this;

        return (
            <form id={id} onSubmit={handleSubmit}>
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
            </form>
        );
    }
}

class NewPlayListForm extends Component {
    state = { title: '', privacyStatus: 'public' };

    privacyOptions = [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
        { label: 'Unlisted', value: 'unlisted' }
    ];

    setValue = (key, value) => this.setState({ [key]: value });

    handleInput = ({ target: { name, value } }) => this.setValue(name, value);

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onSubmit(this.state);
    };

    render() {
        const {
            state: { title, privacyStatus },
            privacyOptions,
            setValue,
            handleInput,
            handleSubmit
        } = this;

        return (
            <form className="playlist-menu__item" onSubmit={handleSubmit}>
                <input
                    className="playlist-menu__item-text"
                    name="title"
                    value={title}
                    placeholder="Playlist title"
                    onChange={handleInput}
                />

                <DropDown
                    currentValue={privacyStatus}
                    options={privacyOptions}
                    onSelect={(value) => setValue('privacyStatus', value)}
                />

                <Button type="submit" title="Create" />
            </form>
        );
    }
}

class PlaylistManager extends Component {
    onCreatePlaylist = (data) => this.props.onClickItem(data);

    onClickItem = (playlistId) => () => this.props.onClickItem({ playlistId });

    render() {
        const {
            props: { items, loadContent },
            onCreatePlaylist,
            onClickItem
        } = this;

        return (
            <div className="playlist-menu">
                <NewPlayListForm onSubmit={onCreatePlaylist} />

                <Grid
                    items={items}
                    loadContent={loadContent}
                    renderItem={({ id, title, itemCount }) => (
                        <button
                            className="playlist-menu__item"
                            key={id}
                            onClick={onClickItem(id)}
                        >
                            <span className="playlist-menu__item-text">
                                {title}
                            </span>

                            <span className="playlist-menu__item-count">
                                {itemCount}
                            </span>
                        </button>
                    )}
                />
            </div>
        );
    }
}

class Prompt extends Component {
    render() {
        const {
            props: {
                mode,
                form,
                playlists,
                isVisible,
                promptText,
                confirmText,
                cancelText,
                callback,
                getPlaylists,
                closePrompt
            }
        } = this;

        return (
            <Fade
                className="dialog__overlay"
                onClick={closePrompt}
                in={isVisible}
            >
                <div className="dialog shadow--2dp" onClick={stopPropagation()}>
                    <header className="dialog__header">
                        <Icon name="prompt" />
                        {promptText}
                    </header>

                    {form ? (
                        <div className="dialog__content">
                            <ImportVideoForm
                                id="importVideos"
                                onSubmit={callback}
                            />
                        </div>
                    ) : mode === 'playlist' ? (
                        <div className="dialog__content">
                            <PlaylistManager
                                items={playlists.items}
                                loadContent={() =>
                                    playlists.nextPageToken !== null &&
                                    getPlaylists({
                                        mine: true,
                                        pageToken: playlists.nextPageToken
                                    })
                                }
                                onClickItem={callback}
                            />
                        </div>
                    ) : null}

                    <footer className="dialog__actions">
                        {mode !== 'playlist' ? (
                            <Button
                                className="button button--close shadow--2dp"
                                onClick={closePrompt}
                                title={cancelText}
                            />
                        ) : null}

                        <Button
                            className="button shadow--2dp"
                            type={form ? 'submit' : 'button'}
                            form={form ? 'importVideos' : ''}
                            onClick={
                                form
                                    ? () => {}
                                    : mode === 'playlist'
                                        ? closePrompt
                                        : callback
                            }
                            title={confirmText}
                        />
                    </footer>
                </div>
            </Fade>
        );
    }
}

const mapStateToProps = ({ prompt, playlists: { items, nextPageToken } }) => ({
    ...prompt,
    playlists: { items, nextPageToken }
});

const mapDispatchToProps = (dispatch) => ({
    getPlaylists: (data) => dispatch(getPlaylists(data)),

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
