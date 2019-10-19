import React, { Component } from 'react';
import { connect } from 'react-redux';

import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import DraggableList from '../DraggableList';
import Placeholder from '../Placeholder';

import Fade from '../animations/Fade';

import {
    setQueue,
    setActiveQueueItem,
    removeQueueItem,
    editPlaylistItem
} from '../../actions/youtube';

class Queue extends Component {
    state = { videoId: '', isMenuOpen: false };

    openMenu = (videoId) => this.setState({ isMenuOpen: true, videoId });

    closeMenu = () => this.setState({ isMenuOpen: false, videoId: '' });

    componentDidUpdate() {
        const {
            props: { showQueue },
            state: { isMenuOpen },
            closeMenu
        } = this;

        if (!showQueue && isMenuOpen) {
            closeMenu();
        }
    }

    render() {
        const {
            props: {
                items,
                showQueue,
                isPlaying,
                isBuffering,
                togglePlay,
                setQueue,
                setActiveQueueItem,
                removeQueueItem,
                editPlaylistItem
            },
            state: { videoId, isMenuOpen },
            openMenu,
            closeMenu
        } = this;

        return (
            <section
                className="queue shadow--2dp"
                data-state={showQueue ? 'visible' : 'hidden'}
            >
                <QueueHeader />

                {items.length ? (
                    <DraggableList
                        className="queue__items"
                        items={items}
                        renderItem={({ active, id, ...data }, index) => (
                            <QueueItem
                                {...data}
                                isActive={active}
                                icon={
                                    active && isBuffering
                                        ? 'loading'
                                        : active && isPlaying
                                        ? 'pause'
                                        : 'play'
                                }
                                onClick={
                                    active
                                        ? togglePlay
                                        : () => setActiveQueueItem(index)
                                }
                                onClickMenu={() => openMenu(id)}
                            />
                        )}
                        onReorderItems={setQueue}
                    />
                ) : (
                    <Placeholder icon="empty" text="No videos in queue." />
                )}

                <Fade in={isMenuOpen}>
                    <Menu onClick={closeMenu}>
                        <MenuItem
                            title="Add to playlist"
                            icon="playlist-add"
                            onClick={() => editPlaylistItem(videoId)}
                        />
                        <MenuItem
                            title="Remove from queue"
                            icon="delete"
                            onClick={() => removeQueueItem(videoId)}
                        />
                    </Menu>
                </Fade>
            </section>
        );
    }
}

const mapStateToProps = ({ player: { queue: items, showQueue } }) => ({
    items,
    showQueue
});

const mapDispatchToProps = {
    setQueue,
    setActiveQueueItem,
    removeQueueItem,
    editPlaylistItem
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Queue);
