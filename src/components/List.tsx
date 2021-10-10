import { Component, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { throttle, isMobile } from '../lib/helpers';

import Autosizer, { Size } from './Autosizer';
import VirtualizedList from './VirtualizedList';
import Icon from './Icon';

const rowHeight = isMobile() ? 3 : 6;

/* TODO: implement solid virtual List, memoize */
interface Props {
    className?: string;
    items: unknown[];
    itemSize?: number | ((containerHeight: number) => number);
    renderItem: (data: any) => Element;
    loadMoreItems: Function;
}

const List: Component<Props> = ({
    className,
    items,
    itemSize,
    renderItem,
    loadMoreItems
}) => {
    const [isLoading, setIsLoading] = createSignal(false);
    let outerContainer;
    let innerContainer;
    let isUnmounting = false;

    const _loadMoreItems = async () => {
        if (isLoading()) {
            return;
        }

        setIsLoading(true);

        await loadMoreItems();

        if (!isUnmounting) {
            setIsLoading(false);
        }
    };

    const handleScroll = throttle(({ scrollOffset }: ListOnScrollProps) => {
        if (!(outerContainer && innerContainer)) {
            return;
        }

        const scrollPosition = scrollOffset + outerContainer.offsetHeight;

        if (scrollPosition >= innerContainer.offsetHeight - 1) {
            _loadMoreItems();
        }
    }, 10);

    const renderLoader = () => (
        <Transition name="fade" appear={true}>
            <div className="list__loading">
                <Icon name="loading" />
            </div>
        </Transition>
    );

    const _itemSize = (containerHeight: number): number => {
        switch (typeof itemSize) {
            case 'function':
                return itemSize(containerHeight);
            case 'number':
                return itemSize;

            default:
                return containerHeight / rowHeight;
        }
    };

    const Row = (index: number) => (
        <div className="list__item">
            <Show when={index < items.length} fallback={renderLoader()}>
                {renderItem(index)}
            </Show>
        </div>
    );

    onMount(_loadMoreItems);

    onCleanup(() => (isUnmounting = true));

    return (
        <Autosizer>
            {({ height, width }: Size) => {
                console.log({ height, width });

                return (
                    <VirtualizedList
                        className={['list', className]
                            .filter(Boolean)
                            .join(' ')}
                        height={height}
                        totalCount={isLoading ? items.length + 1 : items.length}
                        itemHeight={_itemSize(height)}
                        onScroll={handleScroll}
                    >
                        {Row}
                    </VirtualizedList>
                );
            }}
        </Autosizer>
    );
};

export default List;
