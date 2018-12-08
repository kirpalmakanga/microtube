import React, { PureComponent } from 'react';
import Icon from './Icon';

class DropDown extends PureComponent {
    state = { isOpen: false };

    toggleOptions = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

    handleOptionClick = (value) => {
        this.toggleOptions();

        this.props.onSelect(value);
    };

    render() {
        const {
            props: { currentValue, options = {}, onSelect },
            state: { isOpen },
            toggleOptions,
            handleOptionClick
        } = this;

        const currentIndex = options.findIndex(
            ({ value }) => value === currentValue
        );

        return (
            <div className={['dropdown', isOpen ? 'is-open' : ''].join(' ')}>
                <div className="dropdown__current" onClick={toggleOptions}>
                    <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
                    <span>{options[currentIndex].label}</span>
                </div>

                <div className="dropdown__options">
                    {options.map(({ label, value }, i) => {
                        const isActiveItem = currentValue === value;

                        return (
                            <div
                                key={i}
                                className={[
                                    'dropdown__options-item',
                                    isActiveItem ? 'is-active' : ''
                                ].join(' ')}
                                onClick={() =>
                                    !isActiveItem && handleOptionClick(value)
                                }
                            >
                                {label}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default DropDown;
