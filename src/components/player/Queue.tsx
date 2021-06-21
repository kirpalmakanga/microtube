import { useEffect, useCallback, FunctionComponent } from 'react';
import MenuWrapper from '../menu/MenuWrapper';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import DraggableList from '../DraggableList';
import Placeholder from '../Placeholder';

import { usePlayer } from '../../store/hooks/player';
import { usePlaylistItems } from '../../store/hooks/playlist-items';
import { copyText, getVideoURL, isMobile, shareURL } from '../../lib/helpers';
import { useNotifications } from '../../store/hooks/notifications';

interface Props {
    isVisible: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    toggleQueue: () => void;
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
    isVisible,
    isPlaying,
    isBuffering,
    toggleQueue,
    togglePlay
}) => {
    const [
        { queue: items, currentId },
        {
            subscribeToQueue,
            subscribeToCurrentQueueId,
            setQueue,
            clearQueue,
            removeQueueItem,
            setActiveQueueItem,
            clearNewQueueItems,
            importVideos
        }
    ] = usePlayer();

    const [, { editPlaylistItem }] = usePlaylistItems();

    const [, { openNotification }] = useNotifications();

    const handleClickMenu = useCallback(
        (data: QueueItemData, callback: Function) => () => {
            const { title } = data;

            callback(data, title);
        },
        []
    );

    const handleSharing = ({ id, title }: QueueItemData) => {
        const url = getVideoURL(id);

        if (isMobile()) {
            shareURL({
                title,
                url
            });
        } else {
            copyText(url);

            openNotification('Copied link to clipboard.');
        }
    };

    useEffect(() => {
        const unsubscribe = subscribeToQueue();

        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToCurrentQueueId();

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (isVisible) {
            clearNewQueueItems();
        }
    }, [isVisible]);

    return (
        <section
            className={`Queue shadow--2dp ${isVisible ? 'is-visible' : ''}`}
        >
            <QueueHeader
                itemCount={items.length}
                onClickClose={toggleQueue}
                onClickImport={importVideos}
                onClickClear={clearQueue}
            />

            <div className="Queue__Content">
                {items.length ? (
                    <MenuWrapper
                        menuItems={[
                            {
                                title: 'Save to playlist',
                                icon: 'folder-add',
                                onClick: editPlaylistItem
                            },
                            {
                                title: 'Share',
                                icon: 'share',
                                onClick: handleSharing
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
                                className="Queue__Items"
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
