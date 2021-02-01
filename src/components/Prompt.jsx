import { Component } from 'react';
import { connect } from 'react-redux';

import { getPlaylists } from '../store/actions/youtube';
import { closePrompt } from '../store/actions/app';

import Fade from './animations/Fade';

import Icon from './Icon';

import Button from './Button';
import DropDown from './DropDown';

import List from './List';

import { stopPropagation, preventDefault } from '../lib/helpers';

class ImportVideoForm extends Component {
    state = {
        data: { text: '' }
    };

    handleChange = ({ target: { name, value } }) =>
        this.setState(({ data }) => ({
            data: { ...data, [name]: value }
        }));

    handleSubmit = preventDefault(() => {
        const {
            data: { text }
        } = this.state;

        this.props.onSubmit(text);
    });

    getInputRef = (el) => (this.input = el);

    componentDidMount() {
        this.input.focus();

        this.__keyPressHandler = stopPropagation();
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
                        rows="10"
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

    handleInput = stopPropagation(({ target: { name, value } }) =>
        this.setValue(name, value)
    );

    handleSubmit = preventDefault(() => {
        this.props.onSubmit(this.state);
    });

    getInputRef = (el) => (this.input = el);

    componentDidMount() {
        this.__keyDownHandler = stopPropagation();
        this.input.addEventListener('keydown', this.__keyDownHandler);
    }

    componentWillUnmount() {
        this.input.removeEventListener('keydown', this.__keyDownHandler);
    }

    render() {
        const {
            state: { title, privacyStatus },
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
    onCreatePlaylist = (data = {}) =>
        data.title && this.props.onClickItem(data);

    makeOnClickItem = (data) => () => this.props.onClickItem(data);

    renderOption = ({ data: { id: playlistId, title, itemCount } }) => (
        <button
            className="playlist-menu__item"
            key={playlistId}
            onClick={this.makeOnClickItem({ playlistId, title })}
        >
            <span className="playlist-menu__item-text">{title}</span>

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
                        itemKey={(index, data) => data[index].id}
                        loadMoreItems={loadContent}
                        renderItem={renderOption}
                        itemSize={54}
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

const mapDispatchToProps = { getPlaylists, closePrompt };

export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
