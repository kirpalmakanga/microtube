import {
    Component,
    createSignal,
    JSXElement,
    onCleanup,
    onMount,
    Show
} from 'solid-js';
import { Transition } from 'solid-transition-group';
import { throttle, isMobile } from '../lib/helpers';

import Autosizer, { Size } from './Autosizer';
import VirtualizedList from './VirtualizedList';
import Icon from './Icon';

const visibleRowsCount = isMobile() ? 4 : 6;

interface Props {
    className?: string;
    items: unknown[];
    itemSize?: number | ((containerHeight: number) => number);
    children: (data: any) => JSXElement;
    loadMoreItems: Function;
}

const Loader = () => (
    <Transition name="fade" appear={true}>
        <div className="list__loading">
            <Icon name="loading" />
        </div>
    </Transition>
);

const List: Component<Props> = (props) => {
    const [isLoading, setIsLoading] = createSignal(false);
    let isUnmounting = false;

    const _loadMoreItems = async () => {
        console.log(isLoading());

        if (isLoading()) {
            return;
        }

        setIsLoading(true);

        await props.loadMoreItems();

        if (!isUnmounting) {
            setIsLoading(false);
        }
    };

    const handleScroll = throttle(
        ({ currentTarget: { scrollTop, scrollHeight, offsetHeight } }) => {
            if (scrollTop >= scrollHeight - offsetHeight) {
                console.log('end of scroll');
                _loadMoreItems();
            }
        },
        10
    );

    const _itemSize = (containerHeight: number): number => {
        switch (typeof props.itemSize) {
            case 'function':
                return props.itemSize(containerHeight);
            case 'number':
                return props.itemSize;

            default:
                return containerHeight / visibleRowsCount;
        }
    };

    onMount(() => console.log('mount:list'));

    onCleanup(() => (isUnmounting = true));

    return (
        <Autosizer>
            {({ height, width }: Size): JSXElement => {
                console.log({ height, width });
                const itemHeight = _itemSize(height);

                return (
                    <VirtualizedList
                        className={['list', props.className]
                            .filter(Boolean)
                            .join(' ')}
                        width={width}
                        height={height}
                        totalCount={
                            isLoading()
                                ? props.items.length + 1
                                : props.items.length
                        }
                        itemHeight={itemHeight}
                        buffer={visibleRowsCount}
                        onScroll={handleScroll}
                    >
                        {(index: number) => (
                            <div
                                className="list__item"
                                style={{ height: `${itemHeight}px` }}
                            >
                                {`Test${index}`}
                                {/* <Show
                                    when={index < props.items.length}
                                    fallback={<Loader />}
                                >
                                    {props.children(index)}
                                </Show> */}
                            </div>
                        )}
                    </VirtualizedList>
                );
            }}
        </Autosizer>
    );
};

export default List;
