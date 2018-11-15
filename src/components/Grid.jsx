import React, { Component, PureComponent } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import Waypoint from 'react-waypoint';

class GridItem extends PureComponent {
    render() {
        const { showContent, renderChildren = () => {}, ...props } = this.props;

        return (
            <div
                className={['grid__item', showContent ? '' : 'hidden'].join(
                    ' '
                )}
            >
                {showContent && typeof renderChildren === 'function'
                    ? renderChildren(props)
                    : null}
            </div>
        );
    }
}

class Grid extends Component {
    state = {
        isLoading: false
    };

    getContainer = (el) => (this.grid = el);

    loadItems = () => {
        const {
            props: { loadContent },
            state: { isLoading }
        } = this;

        if (isLoading) {
            return;
        }

        this.setState({ isLoading: true }, async () => {
            await loadContent();

            this.setState({ isLoading: false });
        });
    };

    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        const {
            props: { items = [], renderItem = () => {} },
            state: { isLoading },
            getContainer
        } = this;

        return (
            <div className="grid" ref={getContainer}>
                {this.grid &&
                    items.map((props, i) => (
                        <VisibilitySensor
                            key={i}
                            resizeCheck={true}
                            partialVisibility={true}
                            scrollCheck={true}
                            scrollThrottle={100}
                            containment={this.grid}
                        >
                            {({ isVisible }) => (
                                <GridItem
                                    {...props}
                                    showContent={isVisible}
                                    renderChildren={renderItem}
                                />
                            )}
                        </VisibilitySensor>
                    ))}

                <div
                    className={[
                        'grid__loading',
                        isLoading ? 'is-active' : ''
                    ].join(' ')}
                >
                    {this.grid ? (
                        <Waypoint
                            scrollableAncestor={this.grid}
                            onEnter={this.loadItems}
                        />
                    ) : null}

                    <svg className="rotating">
                        <use xlinkHref="#icon-loading" />
                    </svg>
                </div>
            </div>
        );
    }
}

export default Grid;
