import {
    createMemo,
    createSignal,
    For,
    Show,
    Component,
    Accessor
} from 'solid-js';
import { Transition } from 'solid-transition-group';
import isEqual from 'lodash/isEqual';

import Icon from './Icon';

import { stopPropagation, preventDefault } from '../lib/helpers';

interface OptionsData {
    label: string;
    value: unknown;
}

interface Props {
    currentValue: string | number;
    options: OptionsData[];
    onSelect: (value: unknown) => void;
}

const DropDown: Component<Props> = (props) => {
    const [isOpen, setOpenStatus] = createSignal(false);
    const label = createMemo(() => {
        const { label = '', value } =
            props.options.find(
                ({ value }: OptionsData) => value === props.currentValue
            ) || {};

        return label || String(value);
    });

    const closeOptions = () => isOpen() && setOpenStatus(false);

    const toggleOptions = () => {
        console.log(!isOpen());
        setOpenStatus(!isOpen());
    };

    const handleOptionClick = (value: unknown, isActiveItem: boolean) =>
        preventDefault(() => !isActiveItem && props.onSelect(value));

    return (
        <div className="dropdown" onClick={stopPropagation()}>
            <button
                className="dropdown__trigger"
                onClick={toggleOptions}
                onBlur={closeOptions}
                type="button"
            >
                <Icon name={isOpen() ? 'chevron-up' : 'chevron-down'} />
                <span className="dropdown__trigger-title">{label()}</span>
            </button>

            <Transition name="fade" appear={true}>
                <Show when={isOpen()}>
                    <ul className="dropdown__list shadow--2dp">
                        <For each={props.options}>
                            {({ label, value }) => {
                                const isActiveItem =
                                    props.currentValue === value;

                                return (
                                    <li
                                        className={'dropdown__list-item'}
                                        classList={{
                                            'is-active': isActiveItem
                                        }}
                                        onClick={handleOptionClick(
                                            value,
                                            isActiveItem
                                        )}
                                    >
                                        {label}
                                    </li>
                                );
                            }}
                        </For>
                    </ul>
                </Show>
            </Transition>
        </div>
    );
};

export default DropDown;
