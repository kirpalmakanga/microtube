import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getPlaylists } from '../actions/youtube';

import Fade from './animations/Fade';

import Icon from './Icon';

import Button from './Button';
import DropDown from './DropDown';

import List from './List';

import { delay, stopPropagation } from '../lib/helpers';

class ImportVideoForm extends Component {
    state = {
        data: { text: '' }
    };

    handleChange = ({ target: { name, value } }) =>
        this.setState(({ data }) => ({
            data: { ...data, [name]: value }
        }));

    handleSubmit = (e) => {
        e.preventDefault();

        const {
            data: { text }
        } = this.state;

        this.props.onSubmit(text);
    };

    getInputRef = (el) => (this.input = el);

    componentDidMount() {
        this.input.focus();

        this.__keyPressHandler = (e) => e.stopPropagation();
        this.input.addEventListener('keypress', this.__keyPressHandler);
    }

    componentWillUnmount() {
        this.input.removeEventListener('keypress', this.__keyPressHandler);
    }

    render() {
        const {
            state: {
                data: { text }
            },
            props: { id = '' },
            getInputRef,
            handleChange,
            handleSubmit
        } = this;

        return (
            <form id={id} onSubmit={handleSubmit}>
                <div className="textfield">
                    <textarea
                        id="videoId"
                        ref={getInputRef}
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
    state = { newPlaylistTitle: '', privacyStatus: 'public' };

    privacyOptions = [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
        { label: 'Unlisted', value: 'unlisted' }
    ];

    setValue = (key, value) => this.setState({ [key]: value });

    handleInput = stopPropagation(({ target: { name, value } }) =>
        this.setValue(name, value)
    );

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onSubmit(this.state);
    };

    getInputRef = (el) => (this.input = el);

    componentDidMount() {
        this.input.focus();

        this.__keyPressHandler = (e) => e.stopPropagation();
        this.input.addEventListener('keypress', this.__keyPressHandler);
    }

    componentWillUnmount() {
        this.input.removeEventListener('keypress', this.__keyPressHandler);
    }

    render() {
        const {
            state: { newPlaylistTitle, privacyStatus },
            getInputRef,
            privacyOptions,
            setValue,
            handleInput,
            handleSubmit
        } = this;

        return (
            <form className="playlist-menu__form" onSubmit={handleSubmit}>
                <input
                    ref={getInputRef}
                    className="playlist-menu__item-text"
                    name="newPlaylistTitle"
                    value={newPlaylistTitle}
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
    onCreatePlaylist = (data = {}) =>
        data.newPlaylistTitle && this.props.onClickItem(data);

    makeOnClickItem = (data) => () => this.props.onClickItem(data);

    renderOption = ({
        data: { id: playlistId, title: playlistTitle, itemCount }
    }) => (
        <button
            className="playlist-menu__item"
            key={playlistId}
            onClick={this.makeOnClickItem({ playlistId, playlistTitle })}
        >
            <span className="playlist-menu__item-text">{playlistTitle}</span>

            <span className="playlist-menu__item-count">{itemCount}</span>
        </button>
    );

    render() {
        const {
            props: { items, loadContent },
            onCreatePlaylist,
            renderOption
        } = this;

        return (
            <div className="playlist-menu">
                <NewPlayListForm onSubmit={onCreatePlaylist} />

                <div className="playlist-menu__items">
                    <List
                        items={items}
                        loadMoreItems={loadContent}
                        renderItem={renderOption}
                        itemSize={50}
                    />
                </div>
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

        await delay(200);

        dispatch({ type: 'prompt/RESET' });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Prompt);
