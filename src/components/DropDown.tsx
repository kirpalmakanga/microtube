import { useState, useCallback, FunctionComponent } from 'react';
import Icon from './Icon';

import { stopPropagation, preventDefault } from '../lib/helpers';

interface OptionsData {
    label: string;
    value: unknown;
}

interface Props {
    currentValue: unknown;
    options: OptionsData[];
    onSelect: (value: unknown) => void;
}

const DropDown: FunctionComponent<Props> = ({
    currentValue,
    options = [],
    onSelect
}) => {
    const [isOpen, setOpenStatus] = useState(false);

    const closeOptions = useCallback(() => isOpen && setOpenStatus(false), [
        currentValue,
        isOpen
    ]);

    const toggleOptions = useCallback(() => setOpenStatus(!isOpen), [
        currentValue,
        isOpen
    ]);

    const handleOptionClick = useCallback(
        (value: unknown, isActiveItem: boolean) =>
            preventDefault(() => !isActiveItem && onSelect(value)),
        [currentValue]
    );

    const currentIndex = options.findIndex(
        ({ value }) => value === currentValue
    );

    const {
        [currentIndex]: { label = '' }
    } = options;

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
                <span className="dropdown__trigger-title">{label}</span>
            </button>

            <ul className="dropdown__list shadow--2dp">
                {options.map(({ label, value }) => {
                    const isActiveItem = currentValue === value;

                    return (
                        <li
                            key={label}
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
