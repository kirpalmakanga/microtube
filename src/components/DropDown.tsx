import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { preventDefault, stopPropagation } from '../lib/helpers';
import Icon from './Icon';

interface OptionsData {
    label: string;
    value: any;
}

interface Props {
    currentValue: string | number;
    options: OptionsData[];
    onSelect: (value: any) => void;
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
        <div class="relative">
            <button
                class="h-12 p-4 flex items-center gap-2 transition-colors text-light-50 bg-primary-900 hover:bg-primary-800"
                type="button"
                onClick={stopPropagation(toggleOptions)}
                onBlur={closeOptions}
            >
                <span class="font-montserrat text-sm">{label()}</span>

                <Icon
                    class="h-6 w-6"
                    name={isOpen() ? 'chevron-up' : 'chevron-down'}
                />
            </button>

            <Transition name="fade">
                <Show when={isOpen()}>
                    <ul class="absolute right-0 left-0 top-full shadow">
                        <For each={props.options}>
                            {({ label, value }) => {
                                const isActiveItem =
                                    props.currentValue === value;

                                return (
                                    <li
                                        class="h-12 p-4 flex items-centerfont-montserrat text-light-50 text-sm transition-colors bg-primary-900 hover:bg-primary-800 cursor-pointer"
                                        classList={{
                                            'bg-primary-700': isActiveItem
                                        }}
                                        onClick={stopPropagation(
                                            handleOptionClick(
                                                value,
                                                isActiveItem
                                            )
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
