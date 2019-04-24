import React, { Component } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { throttle, isMobile } from '../lib/helpers.js';

import Fade from '../components/animations/Fade';
import Icon from '../components/Icon';

const noop = () => {};

class List extends Component {
    static defaultProps = {
        items: [],
        itemKey: noop,
        renderItem: noop,
        loadMoreItems: noop
    };

    state = { isLoading: false };

    _getInnerContainer = (el) => (this.innerContainer = el);

    _loadMoreItems = async () => {
        const {
            props: { loadMoreItems },
            state: { isLoading }
        } = this;

        if (isLoading) {
            return;
        }

        this.setState({ isLoading: true });

        await loadMoreItems();

        this.setState({ isLoading: false });
    };

    _handleScroll = throttle(({ scrollOffset }) => {
        const { innerContainer } = this;

        if (!innerContainer) {
            return;
        }

        if (
            innerContainer.offsetHeight ===
            scrollOffset + innerContainer.parentNode.offsetHeight
        ) {
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
        const { itemKey = noop } = this.props;

        return (index, data) => (data[index] ? itemKey(index, data) : index);
    };

    componentDidMount() {
        this._loadMoreItems();
    }

    render() {
        const {
            props: { items },
            state: { isLoading },
            _renderLoader,
            _handleScroll,
            _renderRow,
            _getInnerContainer,
            _getItemKey
        } = this;

        return isLoading && !items.length ? (
            _renderLoader()
        ) : (
            <AutoSizer>
                {({ height, width }) => (
                    <FixedSizeList
                        className="list"
                        height={height}
                        width={width}
                        innerRef={_getInnerContainer}
                        itemKey={_getItemKey()}
                        itemData={[...items]}
                        itemCount={isLoading ? items.length + 1 : items.length}
                        itemSize={height / (isMobile ? 3 : 6)}
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
