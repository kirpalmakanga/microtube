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
            props: { currentValue, options = {} },
            state: { isOpen },
            toggleOptions,
            handleOptionClick
        } = this;

        const currentIndex = options.findIndex(
            ({ value }) => value === currentValue
        );

        return (
            <div className="dropdown" data-state={isOpen ? 'open' : 'closed'}>
                <div className="dropdown__header" onClick={toggleOptions}>
                    <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
                    <span className="dropdown__header-title">
                        {options[currentIndex].label}
                    </span>
                </div>

                <ul className="dropdown__list shadow--2dp">
                    {options.map(({ label, value }, i) => {
                        const isActiveItem = currentValue === value;

                        return (
                            <li
                                key={i}
                                className={[
                                    'dropdown__list-item',
                                    isActiveItem ? 'is-active' : ''
                                ].join(' ')}
                                onClick={() =>
                                    !isActiveItem && handleOptionClick(value)
                                }
                            >
                                {label}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default DropDown;
