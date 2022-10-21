import { VirtualContainer } from '@minht11/solid-virtual-container';
import { createSignal, JSXElement, onCleanup, onMount, Show } from 'solid-js';
import { throttle } from '../lib/helpers';
import Icon from './Icon';

type ListItemProps = { index: number; data: any };

interface Props {
    class?: string;
    items: unknown[];
    itemSize?: number | undefined;
    children: (props: ListItemProps) => JSXElement;
    loadItems: Function;
}

const Loader = () => (
    <div class="flex flex-grow items-center justify-center p-4">
        <Icon class="text-light-50 w-8 h-8" name="loading" />
    </div>
);

const List = (props: Props) => {
    const [isLoading, setIsLoading] = createSignal(false);
    let isUnmounting = false;

    const _loadItems = async () => {
        if (isLoading()) {
            return;
        }

        setIsLoading(true);

        await props.loadItems();

        if (!isUnmounting) {
            setIsLoading(false);
        }
    };

    const handleScroll = throttle(
        ({ currentTarget: { scrollTop, scrollHeight, offsetHeight } }) => {
            if (scrollTop >= scrollHeight - offsetHeight - 1) {
                _loadItems();
            }
        },
        10
    );

    const getItemSize = () => props.itemSize || 150;

    let scrollTarget: HTMLDivElement | undefined;

    onMount(() => {
        if (
            !scrollTarget ||
            getItemSize() * props.items.length <= scrollTarget.offsetHeight
        ) {
            _loadItems();
        }
    });

    onCleanup(() => (isUnmounting = true));

    return (
        <div class="relative flex-grow">
            <div
                class="absolute inset-0 flex flex-col overflow-y-auto"
                ref={scrollTarget}
                onScroll={handleScroll}
            >
                <VirtualContainer
                    items={isLoading() ? [...props.items, null] : props.items}
                    itemSize={{ height: getItemSize() }}
                    scrollTarget={scrollTarget}
                    overscan={5}
                >
                    {(itemProps) => (
                        <div
                            class="flex w-full not-last:(border-b-1 border-primary-800)"
                            style={itemProps.style}
                        >
                            <Show
                                when={itemProps.index < props.items.length}
                                fallback={<Loader />}
                            >
                                {props.children({
                                    index: itemProps.index,
                                    data: itemProps.item
                                })}
                            </Show>
                        </div>
                    )}
                </VirtualContainer>
            </div>
        </div>
    );
};

export default List;
