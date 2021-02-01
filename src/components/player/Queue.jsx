import { useDispatch, useSelector } from 'react-redux';

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
} from '../../store/actions/youtube';

const Queue = ({ isPlaying, isBuffering, togglePlay }) => {
    const dispatch = useDispatch();
    const { items, currentId, showQueue } = useSelector(
        ({ player: { queue: items, currentId, showQueue } }) => ({
            items,
            currentId,
            showQueue
        })
    );

    const handleSetQueue = (queue) => dispatch(setQueue(queue));
    const handleEditPlaylistItem = ({ id }) => dispatch(editPlaylistItem(id));
    const handleRemoveQueueItem = ({ id }) => dispatch(removeQueueItem(id));
    const handleSetActiveQueueItem = (id) => dispatch(setActiveQueueItem(id));

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
                                title: 'Save to playlist',
                                icon: 'folder-add',
                                onClick: handleEditPlaylistItem
                            },
                            {
                                title: 'Remove from queue',
                                icon: 'delete',
                                onClick: handleRemoveQueueItem
                            }
                        ]}
                    >
                        {(openMenu) => (
                            <DraggableList
                                className="queue__items"
                                items={items}
                                renderItem={(data) => {
                                    const { id } = data;
                                    const isActive = id === currentId;

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
                                                          handleSetActiveQueueItem(
                                                              id
                                                          )
                                            }
                                            onClickMenu={() =>
                                                openMenu(data, data.title)
                                            }
                                        />
                                    );
                                }}
                                onReorderItems={handleSetQueue}
                            />
                        )}
                    </MenuWrapper>
                ) : (
                    <Placeholder icon="list" text="No videos in queue." />
                )}
            </div>
        </section>
    );
};

export default Queue;
