import { Component, onCleanup, onMount, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { copyText, getVideoURL, isMobile, shareURL } from '../../lib/helpers';
import { useMenu } from '../../store/hooks/menu';
import { useNotifications } from '../../store/hooks/notifications';
import { usePlayer } from '../../store/hooks/player';
import { usePlaylistItems } from '../../store/hooks/playlist-items';
import Placeholder from '../Placeholder';
import SortableList from '../SortableList';
import QueueHeader from './QueueHeader';
import QueueItem from './QueueItem';

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

    const [, { openMenu }] = useMenu();

    const handleClickMenu = (callbackData: QueueItemData) => () => {
        const { title } = callbackData;

        openMenu({
            title,
            callbackData,
            items: [
                {
                    title: 'Save to playlist',
                    icon: 'folder-add',
                    onClick: editPlaylistItem
                },
                {
                    title: 'Share',
                    icon: 'share',
                    onClick: ({ id, title }: QueueItemData) => {
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
                    }
                },
                {
                    title: 'Remove from queue',
                    icon: 'delete',
                    onClick: removeQueueItem
                }
            ]
        });
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

            <Transition name="fade">
                <Show when={props.isVisible}>
                    <div className="Queue__Content">
                        <Show
                            when={player.queue.length}
                            fallback={
                                <Placeholder
                                    icon="list"
                                    text="The queue is empty."
                                />
                            }
                        >
                            <div className="Queue__Items">
                                <SortableList
                                    items={player.queue}
                                    getItemId={({ id }: QueueItemData) => id}
                                    onReorderItems={setQueue}
                                >
                                    {(data: QueueItemData) => {
                                        const { id } = data;
                                        const isActive =
                                            id === player.currentId;

                                        let icon = 'play';

                                        if (isActive && props.isBuffering) {
                                            icon = 'loading';
                                        }

                                        if (isActive && props.isPlaying) {
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
                                                        : setActiveQueueItem(id)
                                                }
                                                onContextMenu={handleClickMenu(
                                                    data
                                                )}
                                            />
                                        );
                                    }}
                                </SortableList>
                            </div>
                        </Show>
                    </div>
                </Show>
            </Transition>
        </section>
    );
};

export default Queue;
