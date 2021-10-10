import { createSignal, For, Component } from 'solid-js';
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

const DropDown: Component<Props> = ({
    currentValue,
    options = [],
    onSelect
}) => {
    const [isOpen, setOpenStatus] = createSignal(false);

    const closeOptions = () => isOpen() && setOpenStatus(false);

    const toggleOptions = () => setOpenStatus(!isOpen());

    const handleOptionClick = (value: unknown, isActiveItem: boolean) =>
        preventDefault(() => !isActiveItem && onSelect(value));

    const currentIndex = options.findIndex(
        ({ value }) => value === currentValue
    );

    const {
        [currentIndex]: { label = '' }
    } = options;

    return (
        <div
            className="dropdown"
            data-state={isOpen() ? 'open' : 'closed'}
            onClick={stopPropagation()}
        >
            <button
                className="dropdown__trigger"
                onClick={toggleOptions}
                onBlur={closeOptions}
                type="button"
            >
                <Icon name={isOpen() ? 'chevron-up' : 'chevron-down'} />
                <span className="dropdown__trigger-title">{label}</span>
            </button>

            <ul className="dropdown__list shadow--2dp">
                <For each={options}>
                    {({ label, value }) => {
                        const isActiveItem = currentValue === value;

                        return (
                            <li
                                className={[
                                    'dropdown__list-item',
                                    isActiveItem ? 'is-active' : ''
                                ]
                                    .join(' ')
                                    .trim()}
                                onClick={handleOptionClick(value, isActiveItem)}
                            >
                                {label}
                            </li>
                        );
                    }}
                </For>
            </ul>
        </div>
    );
};

export default DropDown;
