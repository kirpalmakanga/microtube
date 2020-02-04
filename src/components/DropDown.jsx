import { PureComponent } from 'react';
import Icon from './Icon';

import { stopPropagation, preventDefault } from '../lib/helpers';

class DropDown extends PureComponent {
    state = { isOpen: false };

    closeOptions = () => this.state.isOpen && this.setState({ isOpen: false });

    toggleOptions = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

    handleOptionClick = (value) =>
        preventDefault(() => {
            const {
                props: { onSelect },
                closeOptions
            } = this;

            closeOptions();

            onSelect(value);
        });

    render() {
        const {
            props: { currentValue, options = {} },
            state: { isOpen },
            toggleOptions,
            closeOptions,
            handleOptionClick
        } = this;

        const currentIndex = options.findIndex(
            ({ value }) => value === currentValue
        );

        return (
            <div
                className="dropdown"
                data-state={isOpen ? 'open' : 'closed'}
                onClick={stopPropagation()}
            >
                <button
                    className="dropdown__trigger"
                    onClick={toggleOptions}
                    onBlur={closeOptions}
                    type="button"
                >
                    <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
                    <span className="dropdown__trigger-title">
                        {options[currentIndex].label}
                    </span>
                </button>

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
                                onClick={handleOptionClick(value, isActiveItem)}
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
