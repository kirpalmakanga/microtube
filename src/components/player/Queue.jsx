import React, { Component } from 'react';
import { connect } from 'react-redux';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import Placeholder from '../Placeholder';
import DraggableList from '../DraggableList';

import {
    setQueue,
    setActiveQueueItem,
    removeQueueItem,
    editPlaylistItem
} from '../../actions/youtube';

import { pick } from '../../lib/helpers';

const Queue = ({
    items,
    showQueue,
    isPlaying,
    isBuffering,
    togglePlay,
    setQueue,
    setActiveQueueItem,
    removeQueueItem,
    editPlaylistItem
}) => {
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
                    renderItem={({ active, ...data }, index) => (
                        <QueueItem
                            {...pick(data, ['title', 'duration'])}
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
                            onClickRemove={() => removeQueueItem(index)}
                            editPlaylistItem={() => editPlaylistItem(data.id)}
                        />
                    )}
                    onReorderItems={setQueue}
                />
            ) : (
                <Placeholder icon="empty" text="No videos in queue." />
            )}
        </section>
    );
};

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
