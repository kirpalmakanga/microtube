import { useState } from 'react';
import Icon from './Icon';

import { stopPropagation, preventDefault } from '../lib/helpers';

const DropDown = ({ currentValue, options = [], onSelect = () => {} }) => {
    const [isOpen, setOpenStatus] = useState(false);

    const closeOptions = () => isOpen && setOpenStatus(false);

    const toggleOptions = () => setOpenStatus(!isOpen);

    const handleOptionClick = (value, isActiveItem) =>
        preventDefault(() => !isActiveItem && onSelect(value));

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
};

export default DropDown;
