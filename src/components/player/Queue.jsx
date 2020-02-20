import { Component } from 'react';
import { connect } from 'react-redux';

import MenuWrapper from '../menu/MenuWrapper';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import DraggableList from '../DraggableList';
import Placeholder from '../Placeholder';

import {
    setQueue,
    setActiveQueueItem,
    removeQueueItem,
    editPlaylistItem
} from '../../actions/youtube';

class Queue extends Component {
    render() {
        const {
            props: {
                items,
                currentIndex,
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

                <div className="queue__content">
                    {items.length ? (
                        <MenuWrapper
                            menuItems={[
                                {
                                    title: 'Add to playlist',
                                    icon: 'playlist-add',
                                    onClick: ({ id }) => editPlaylistItem(id)
                                },
                                {
                                    title: 'Remove from queue',
                                    icon: 'delete',
                                    onClick: ({ id }) => removeQueueItem(id)
                                }
                            ]}
                        >
                            {(openMenu) => (
                                <DraggableList
                                    className="queue__items"
                                    items={items}
                                    renderItem={(data, index) => {
                                        const isActive = index === currentIndex;

                                        let icon = 'play';

                                        if (isActive && isBuffering) {
                                            icon = 'loading';
                                        }

                                        if (isActive && isPlaying) {
                                            icon = 'pause';
                                        }

                                        return (
                                            <QueueItem
                                                {...data}
                                                isActive={isActive}
                                                icon={icon}
                                                onClick={
                                                    isActive
                                                        ? togglePlay
                                                        : () =>
                                                              setActiveQueueItem(
                                                                  index
                                                              )
                                                }
                                                onClickMenu={() =>
                                                    openMenu(data, data.title)
                                                }
                                            />
                                        );
                                    }}
                                    onReorderItems={setQueue}
                                />
                            )}
                        </MenuWrapper>
                    ) : (
                        <Placeholder icon="empty" text="No videos in queue." />
                    )}
                </div>
            </section>
        );
    }
}

const mapStateToProps = ({
    player: { queue: items, currentIndex, showQueue }
}) => ({
    items,
    currentIndex,
    showQueue
});

const mapDispatchToProps = {
    setQueue,
    setActiveQueueItem,
    removeQueueItem,
    editPlaylistItem
};

export default connect(mapStateToProps, mapDispatchToProps)(Queue);
