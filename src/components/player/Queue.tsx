import { Component, onCleanup, onMount, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { copyText, getVideoURL, isMobile, shareURL } from '../../lib/helpers';
import { useMenu } from '../../store/menu';
import { useNotifications } from '../../store/notifications';
import { usePlayer } from '../../store/player';
import { usePlaylistItems } from '../../store/playlist-items';
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

/* TODO: remplacer QUEUEITEMDATA par VideoData */

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

    const handleClickMenu = (callbackData: VideoData) => () => {
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
                    onClick: ({ id, title }: VideoData) => {
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
            class="fixed top-0 right-0 left-0 bottom-12 flex flex-col bg-primary-400 transition-transform transform shadow overflow-hidden"
            classList={{
                'translate-y-full': !props.isVisible,
                'translate-y-0': props.isVisible
            }}
        >
            <QueueHeader
                itemCount={player.queue.length}
                onClickClose={props.toggleQueue}
                onClickImport={importVideos}
                onClickClear={clearQueue}
            />

            <Transition name="fade">
                <Show when={props.isVisible}>
                    <div class="relative flex flex-col flex-grow">
                        <Show
                            when={player.queue.length}
                            fallback={
                                <Placeholder
                                    icon="list"
                                    text="The queue is empty."
                                />
                            }
                        >
                            <div class="absolute inset-0 overflow-y-auto">
                                <SortableList
                                    items={player.queue}
                                    getItemId={({ id }: VideoData) => id}
                                    onReorderItems={setQueue}
                                >
                                    {(data: VideoData) => {
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
