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

  getContainer = (el) => (this.grid = el);

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
      props: { items = [], renderItem },
      state: { isLoading },
      getContainer
    } = this;

    return (
      <div className='grid' ref={getContainer}>
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
                <div
                  className={['grid__item', isVisible ? '' : 'hidden'].join(
                    ' '
                  )}
                >
                  {isVisible && typeof renderItem === 'function'
                    ? renderItem(props)
                    : null}
                </div>
              )}
            </VisibilitySensor>
          ))}

        <div
          className={['grid__loading', isLoading ? 'is-active' : ''].join(' ')}
        >
          {this.grid ? (
            <Waypoint scrollableAncestor={this.grid} onEnter={this.loadItems} />
          ) : null}
          <svg className='rotating'>
            <use xlinkHref='#icon-loading' />
          </svg>
        </div>
      </div>
    );
  }
}

export default Grid;
