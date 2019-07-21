import React, { Component } from 'react';
import { connect } from 'react-redux';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import DraggableList from '../DraggableList';

import {
    setQueue,
    setActiveQueueItem,
    removeQueueItem,
    editPlaylistItem
} from '../../actions/youtube';

import { pick } from '../../lib/helpers';

class Queue extends Component {
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
            }
        } = this;

        return (
            <section
                className="queue shadow--2dp"
                data-state={showQueue ? 'visible' : 'hidden'}
            >
                <QueueHeader />

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
                            editPlaylistItem={() => editPlaylistItem(data)}
                        />
                    )}
                    onReorderItems={setQueue}
                />
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
