import React, { Component } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { throttle, isMobile } from '../lib/helpers.js';

import Fade from '../components/animations/Fade';
import Icon from '../components/Icon';

const noop = () => {};

class List extends Component {
    static defaultProps = {
        className: '',
        items: [],
        itemKey: noop,
        itemSize: null,
        renderItem: noop,
        loadMoreItems: noop,
        innerRef: noop
    };

    state = { isLoadingMoreItems: false };

    _getOuterContainer = (el) => {
        const { outerRef = noop } = this.props;

        this.outerContainer = el;

        outerRef(el);
    };

    _getInnerContainer = (el) => {
        const { innerRef = noop } = this.props;

        this.innerContainer = el;

        innerRef(el);
    };

    _loadMoreItems = async () => {
        const {
            props: { loadMoreItems },
            state: { isLoadingMoreItems }
        } = this;

        if (isLoadingMoreItems) {
            return;
        }

        this.setState({ isLoadingMoreItems: true });

        await loadMoreItems();

        if (this._isUnmounting) {
            return;
        }

        this.setState({ isLoadingMoreItems: false });
    };

    _handleScroll = throttle(({ scrollOffset }) => {
        const { outerContainer, innerContainer } = this;

        if (!(outerContainer && innerContainer)) {
            return;
        }

        const scrollPosition = scrollOffset + outerContainer.offsetHeight;

        if (scrollPosition >= innerContainer.offsetHeight - 1) {
            this._loadMoreItems();
        }
    }, 10);

    _renderRow = ({ data, index, style }) => {
        const {
            props: { renderItem },
            _renderLoader
        } = this;

        return (
            <div className="list__item" style={style}>
                {index === data.length
                    ? _renderLoader()
                    : renderItem({ data: data[index], index })}
            </div>
        );
    };

    _renderLoader = () => (
        <Fade in={true} className="list__loading">
            <Icon className="rotating" name="loading" />
        </Fade>
    );

    _getItemKey = () => {
        const { itemKey } = this.props;

        return (index, data) => (data[index] ? itemKey(index, data) : index);
    };

    _getItemSize = (containerHeight) => {
        const { itemSize } = this.props;

        if (itemSize) {
            return itemSize;
        }

        return containerHeight / (isMobile() ? 3 : 6);
    };

    componentDidMount() {
        this._loadMoreItems();
    }

    componentWillUnmount() {
        this._isUnmounting = true;
    }

    render() {
        const {
            props: { className, items },
            state: { isLoadingMoreItems },
            _renderLoader,
            _handleScroll,
            _renderRow,
            _getOuterContainer,
            _getInnerContainer,
            _getItemKey,
            _getItemSize
        } = this;

        return isLoadingMoreItems && !items.length ? (
            _renderLoader()
        ) : (
            <AutoSizer>
                {({ height, width }) => (
                    <FixedSizeList
                        className={`list ${className}`.trim()}
                        height={height}
                        width={width}
                        outerRef={_getOuterContainer}
                        innerRef={_getInnerContainer}
                        itemKey={_getItemKey()}
                        itemData={[...items]}
                        itemCount={
                            isLoadingMoreItems ? items.length + 1 : items.length
                        }
                        itemSize={_getItemSize(height)}
                        onScroll={_handleScroll}
                    >
                        {_renderRow}
                    </FixedSizeList>
                )}
            </AutoSizer>
        );
    }
}

export default List;
