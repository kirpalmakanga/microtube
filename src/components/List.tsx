import { Component, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { VirtualContainer } from '@minht11/solid-virtual-container';
import { throttle } from '../lib/helpers';
import Icon from './Icon';

type ListItemProps = { data: any };

interface Props {
    className?: string;
    items: unknown[];
    itemSize?: number | undefined;
    children: ((props: ListItemProps) => Element) & Element;
    loadItems: Function;
}

const Loader = () => (
    <Transition name="fade">
        <div className="list__loading">
            <Icon name="loading" />
        </div>
    </Transition>
);

const List: Component<Props> = (props) => {
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
            if (scrollTop >= scrollHeight - offsetHeight) {
                _loadItems();
            }
        },
        10
    );

    let scrollTarget;

    onMount(_loadItems);

    onCleanup(() => (isUnmounting = true));

    return (
        <div className="list">
            <div
                className="list__inner"
                ref={scrollTarget}
                onScroll={handleScroll}
            >
                <VirtualContainer
                    items={isLoading() ? [...props.items, null] : props.items}
                    itemSize={{ height: props.itemSize || 150 }}
                    scrollTarget={scrollTarget}
                >
                    {(itemProps) => (
                        <div
                            className="list__item"
                            style={itemProps.style}
                            role="listitem"
                        >
                            <Show
                                when={itemProps.index < props.items.length}
                                fallback={<Loader />}
                            >
                                {props.children({
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
