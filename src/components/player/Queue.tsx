import { Component, onCleanup, onMount, Show } from 'solid-js';

import MenuWrapper from '../menu/MenuWrapper';

import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

import SortableList from '../SortableList';
import Placeholder from '../Placeholder';

import { usePlayer } from '../../store/hooks/player';
import { usePlaylistItems } from '../../store/hooks/playlist-items';
import { copyText, getVideoURL, isMobile, shareURL } from '../../lib/helpers';
import { useNotifications } from '../../store/hooks/notifications';
import { Transition } from 'solid-transition-group';

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

/* TODO: fix clearQueue + notification */
const Queue: Component<Props> = (props) => {
    const [
        player,
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

    const handleClickMenu = (data: QueueItemData, callback: Function) => () => {
        const { title } = data;

        callback(data, title);
    };

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

    let unsubscribeFromQueue: () => void;
    let unsubscribeFromCurrentQueueId: () => void;

    onMount(() => {
        clearNewQueueItems();
        unsubscribeFromQueue = subscribeToQueue();
        unsubscribeFromCurrentQueueId = subscribeToCurrentQueueId();
    });

    onCleanup(() => {
        unsubscribeFromQueue();
        unsubscribeFromCurrentQueueId();
    });

    return (
        <section
            className="Queue shadow--2dp"
            classList={{ 'is--visible': props.isVisible }}
        >
            <QueueHeader
                itemCount={player.queue.length}
                onClickClose={props.toggleQueue}
                onClickImport={importVideos}
                onClickClear={clearQueue}
            />

            <Transition name="fade" appear={true}>
                <Show when={props.isVisible}>
                    <div className="Queue__Content">
                        <Show
                            when={player.queue.length}
                            fallback={
                                <Placeholder
                                    icon="list"
                                    text="No videos in queue."
                                />
                            }
                        >
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
                                    <div className="Queue__Items">
                                        <SortableList
                                            items={player.queue}
                                            getItemId={({
                                                id
                                            }: QueueItemData) => id}
                                            onReorderItems={setQueue}
                                        >
                                            {(data: QueueItemData) => {
                                                const { id } = data;
                                                const isActive =
                                                    id === player.currentId;

                                                let icon = 'play';

                                                if (
                                                    isActive &&
                                                    props.isBuffering
                                                ) {
                                                    icon = 'loading';
                                                }

                                                if (
                                                    isActive &&
                                                    props.isPlaying
                                                ) {
                                                    icon = 'pause';
                                                }

                                                return (
                                                    <QueueItem
                                                        {...data}
                                                        isActive={isActive}
                                                        icon={icon}
                                                        onClick={() =>
                                                            isActive
                                                                ? props.togglePlay()
                                                                : setActiveQueueItem(
                                                                      id
                                                                  )
                                                        }
                                                        onContextMenu={handleClickMenu(
                                                            data,
                                                            openMenu
                                                        )}
                                                    />
                                                );
                                            }}
                                        </SortableList>
                                    </div>
                                )}
                            </MenuWrapper>
                        </Show>
                    </div>
                </Show>
            </Transition>
        </section>
    );
};

export default Queue;
