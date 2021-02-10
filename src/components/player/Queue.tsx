import { useCallback, FunctionComponent } from 'react';
import MenuWrapper from '../menu/MenuWrapper';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import DraggableList from '../DraggableList';
import Placeholder from '../Placeholder';

import { usePlayer } from '../../store/hooks/player';

interface Props {
    isPlaying: boolean;
    isBuffering: boolean;
    togglePlay: () => void;
}

interface QueueItemData {
    id: string;
    title: string;
    duration: number;
    isActive: boolean;
    icon: string;
}

const Queue: FunctionComponent<Props> = ({
    isPlaying,
    isBuffering,
    togglePlay
}) => {
    const [
        { queue: items, currentId, showQueue },
        { setQueue, removeQueueItem, setActiveQueueItem }
    ] = usePlayer();

    const editPlaylistItem = () => {}; /* TODO: create hook callback */

    const handleClickMenu = useCallback(
        (data: QueueItemData, callback: Function) => () => {
            const { title } = data;

            callback(data, title);
        },
        []
    );

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
                                onClick: editPlaylistItem
                            },
                            {
                                title: 'Remove from queue',
                                icon: 'delete',
                                onClick: removeQueueItem
                            }
                        ]}
                    >
                        {(openMenu) => (
                            <DraggableList
                                className="queue__items"
                                items={items}
                                renderItem={(data: QueueItemData) => {
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
                                            onClick={() =>
                                                isActive
                                                    ? togglePlay()
                                                    : setActiveQueueItem(id)
                                            }
                                            onContextMenu={handleClickMenu(
                                                data,
                                                openMenu
                                            )}
                                        />
                                    );
                                }}
                                onReorderItems={setQueue}
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
