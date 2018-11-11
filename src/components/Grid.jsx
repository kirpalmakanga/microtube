import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import Waypoint from 'react-waypoint';

class Grid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };
    }

    loadItems = () => {
        const { loadContent } = this.props;
        const { isLoading } = this.state;

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
            props: { items = [], ItemComponent },
            state: { isLoading }
        } = this;

        return (
            <div
                class="grid"
                ref={(el) => {
                    this.grid = el;
                }}
            >
                {this.grid &&
                    items.map((data, i) => (
                        <VisibilitySensor
                            key={i}
                            className={(isVisible) =>
                                ['grid__item', isVisible ? '' : 'hidden'].join(
                                    ' '
                                )
                            }
                            partialVisibility={true}
                            scrollCheck={true}
                            scrollThrottle={100}
                            containment={this.grid}
                            intervalCheck={true}
                        >
                            {({ isVisible }) =>
                                isVisible ? <ItemComponent {...data} /> : null
                            }
                        </VisibilitySensor>
                    ))}

                <div
                    class={['grid__loading', isLoading ? 'is-active' : ''].join(
                        ' '
                    )}
                >
                    {this.grid ? (
                        <Waypoint
                            scrollableAncestor={this.grid}
                            onEnter={this.loadItems}
                        />
                    ) : null}
                    <svg class="rotating">
                        <use xlinkHref="#icon-loading" />
                    </svg>
                </div>
            </div>
        );
    }
}

export default Grid;
