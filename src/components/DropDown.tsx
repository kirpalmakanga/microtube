import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { preventDefault, stopPropagation } from '../lib/helpers';
import Icon from './Icon';

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
    const label = createMemo(
        () => {
            const { label = '', value } =
                props.options.find(
                    ({ value }: OptionsData) => value === props.currentValue
                ) || {};

            return label || String(value);
        },
        props.currentValue,
        { equals: (prev, next) => prev === next }
    );

    const closeOptions = () => {
        if (isOpen()) setOpenStatus(false);
    };

    const toggleOptions = () => {
        setOpenStatus(!isOpen());
    };

    const handleOptionClick = (value: unknown, isActiveItem: boolean) =>
        preventDefault(() => !isActiveItem && props.onSelect(value));

    return (
        <div class="dropdown" onClick={stopPropagation()}>
            <button
                class="dropdown__trigger"
                onClick={toggleOptions}
                onBlur={closeOptions}
                type="button"
            >
                <span class="dropdown__trigger-title">{label()}</span>

                <Icon name={isOpen() ? 'chevron-up' : 'chevron-down'} />
            </button>

            <Transition name="fade">
                <Show when={isOpen()}>
                    <ul class="dropdown__list shadow--2dp">
                        <For each={props.options}>
                            {({ label, value }) => {
                                const isActiveItem =
                                    props.currentValue === value;

                                return (
                                    <li
                                        class={'dropdown__list-item'}
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
