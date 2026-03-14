import { Component, onCleanup, onMount, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { usePlayer } from '../../store/player';
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

const Queue: Component<Props> = (props) => {
    const [
        player,
        {
            subscribeToQueue,
            subscribeToCurrentQueueId,
            setQueue,
            clearQueue,
            setActiveQueueItem,
            clearNewQueueItems
        }
    ] = usePlayer();

    const isActiveItem = (id: string) => id === player.currentId;

    const handleClickItem = (id: string) => () => {
        if (isActiveItem(id)) {
            props.togglePlay();
        } else {
            setActiveQueueItem(id);
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
            class="fixed top-0 right-0 left-0 bottom-12 flex flex-col bg-primary-500 transition-transform transform shadow overflow-hidden"
            classList={{
                'translate-y-full': !props.isVisible,
                'translate-y-0': props.isVisible
            }}
        >
            <QueueHeader
                itemCount={player.queue.length}
                onClickClose={props.toggleQueue}
                onClickClear={clearQueue}
            />

            <Transition name="fade">
                <Show when={props.isVisible}>
                    <div class="relative flex flex-col flex-grow">
                        <Show
                            when={player.queue.length}
                            fallback={<Placeholder icon="list" text="The queue is empty." />}
                        >
                            <div class="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-track-primary-600 scrollbar-thumb-primary-400 hover:scrollbar-thumb-primary-300">
                                <SortableList
                                    sortableClass="h-34 not-last:border-b-1 border-primary-600"
                                    items={player.queue}
                                    getItemId={({ id }: VideoData) => id}
                                    onReorderItems={setQueue}
                                >
                                    {(data: VideoData, index) => {
                                        const { id } = data;

                                        // if (isActive && props.isPlaying) {
                                        //     icon = 'pause';
                                        // }

                                        return (
                                            <QueueItem
                                                {...data}
                                                index={index}
                                                isActive={isActiveItem(id)}
                                                isPlaying={isActiveItem(id) && props.isPlaying}
                                                onClick={handleClickItem(id)}
                                                onClickLink={props.toggleQueue}
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
