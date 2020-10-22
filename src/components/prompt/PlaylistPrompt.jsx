import { Component, useState } from 'react';
import { connect } from 'react-redux';

import List from '../List';
import Button from '../Button';
import DropDown from '../DropDown';
import PromptHeader from './PromptHeader';
import PromptWrapper from './PromptWrapper';
import PromptActions from './PromptActions';

import { editPlaylistItem, getPlaylists } from '../../actions/youtube';

import { stopPropagation, preventDefault } from '../../lib/helpers';

class NewPlayListForm extends Component {
    state = { title: '', privacyStatus: 'public' };

    privacyOptions = [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
        { label: 'Unlisted', value: 'unlisted' }
    ];

    setValue = (key, value) => this.setState({ [key]: value });

    handleKeyDown = stopPropagation();

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
            handleKeyDown,
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
                    onKeyDown={handleKeyDown}
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
            renderOption
        } = this;

        return (
            <div className="playlist-menu">
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

const PlaylistPrompt = ({
    children = () => {},
    items,
    nextPageToken,
    editPlaylistItem,
    getPlaylists
}) => {
    const [videoId, setVideoId] = useState(null);

    const closePrompt = () => setVideoId(null);

    const onPlaylistSelected = (playlistData) => {
        editPlaylistItem(videoId, playlistData);

        closePrompt();
    };

    return (
        <>
            {children(setVideoId)}

            <PromptWrapper close={closePrompt} isVisible={!!videoId}>
                <PromptHeader text="Save to playlist"></PromptHeader>

                <NewPlayListForm onSubmit={onPlaylistSelected} />

                <PlaylistManager
                    items={items}
                    loadContent={() =>
                        nextPageToken !== null &&
                        getPlaylists({
                            mine: true,
                            pageToken: nextPageToken
                        })
                    }
                    onClickItem={onPlaylistSelected}
                />

                <PromptActions>
                    <Button
                        className="button shadow--2dp"
                        onClick={closePrompt}
                    >
                        Done
                    </Button>
                </PromptActions>
            </PromptWrapper>
        </>
    );
};

const mapStateToProps = ({ playlists: { items, nextPageToken } }) => ({
    items,
    nextPageToken
});

const mapDispatchToProps = { editPlaylistItem, getPlaylists };

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPrompt);
