import {
    memo,
    useState,
    useRef,
    useEffect,
    useCallback,
    FunctionComponent,
    ReactNode,
    Key
} from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
    FixedSizeList,
    ListChildComponentProps,
    ListOnScrollProps
} from 'react-window';
import { throttle, isMobile } from '../lib/helpers';

import Fade from './animations/Fade';
import Icon from './Icon';

const rowHeight = isMobile() ? 3 : 6;

interface Props {
    className?: string;
    items: unknown[];
    itemSize?: number | ((containerHeight: number) => number);
    renderItem: (data: any) => ReactNode;
    itemKey?: (data?: any) => Key;
    loadMoreItems: Function;
}

const List: FunctionComponent<Props> = ({
    className,
    items,
    itemSize,
    renderItem,
    loadMoreItems,
    itemKey = () => {}
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const outerContainer = useRef<HTMLDivElement>(null);
    const innerContainer = useRef<HTMLDivElement>(null);
    const isUnmounting = useRef<boolean>(false);

    const _loadMoreItems = useCallback(async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        await loadMoreItems();

        if (!isUnmounting.current) {
            setIsLoading(false);
        }
    }, [isLoading]);

    const handleScroll = throttle(({ scrollOffset }: ListOnScrollProps) => {
        if (!(outerContainer.current && innerContainer.current)) {
            return;
        }

        const scrollPosition =
            scrollOffset + outerContainer.current.offsetHeight;

        if (scrollPosition >= innerContainer.current.offsetHeight - 1) {
            console.log('endOfScroll');
            _loadMoreItems();
        }
    }, 10);

    const renderLoader = useCallback(
        () => (
            <Fade in={true} className="list__loading">
                <Icon name="loading" />
            </Fade>
        ),
        []
    );

    const _itemSize = useCallback((containerHeight: number): number => {
        switch (typeof itemSize) {
            case 'function':
                return itemSize(containerHeight);
            case 'number':
                return itemSize;

            default:
                return containerHeight / rowHeight;
        }
    }, []);

    const _itemKey = useCallback(
        (index, list) => (list[index] ? itemKey(list[index]) : index),
        []
    );

    const Row = useCallback(
        ({
            index,
            data: { [index]: data, length: itemCount },
            style
        }: ListChildComponentProps) => (
            <div className="list__item" style={style}>
                {index === itemCount ? renderLoader() : renderItem(data)}
            </div>
        ),
        []
    );

    useEffect(() => {
        _loadMoreItems();

        return () => {
            isUnmounting.current = true;
        };
    }, []);

    return isLoading && !items.length ? (
        renderLoader()
    ) : (
        <AutoSizer>
            {({ height, width }) => (
                <FixedSizeList
                    className={['list', className].filter(Boolean).join(' ')}
                    height={height}
                    width={width}
                    outerRef={outerContainer}
                    innerRef={innerContainer}
                    itemKey={_itemKey}
                    itemData={[...items]}
                    itemCount={isLoading ? items.length + 1 : items.length}
                    itemSize={_itemSize(height)}
                    onScroll={items.length ? handleScroll : undefined}
                >
                    {Row}
                </FixedSizeList>
            )}
        </AutoSizer>
    );
};

export default memo(List);
