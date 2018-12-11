import React, { Component } from 'react';
import { connect } from 'react-redux';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import DraggableList from '../DraggableList';

import { editPlaylistItem } from '../../actions/youtube';

import { pick } from '../../lib/helpers';

class Queue extends Component {
    render() {
        const {
            props: {
                items,
                showQueue,
                setQueue,
                isPlaying,
                isBuffering,
                togglePlay,
                makeSetActiveItem,
                makeRemoveItem,
                makeEditPlaylistItem
            }
        } = this;

        return (
            <section
                className={[
                    'queue shadow--2dp',
                    showQueue ? 'queue--show' : ''
                ].join(' ')}
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
                                active ? togglePlay : makeSetActiveItem(index)
                            }
                            onClickRemove={makeRemoveItem(index)}
                            editPlaylistItem={makeEditPlaylistItem(data)}
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

const mapDispatchToProps = (dispatch) => ({
    setQueue: (data) => dispatch({ type: 'QUEUE_SET', data }),

    makeSetActiveItem: (index) => () => {
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM',
            data: { index }
        });
    },

    makeRemoveItem: (index) => (e) => {
        e.stopPropagation();
        dispatch({ type: 'QUEUE_REMOVE', data: index });
    },

    makeEditPlaylistItem: (data) => () => dispatch(editPlaylistItem(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Queue);
