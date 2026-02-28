import { createMemo, createSignal, For, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { preventDefault, stopPropagation } from '../lib/helpers';
import Icon from './Icon';

export interface DropDownOption<T> {
    label: string;
    value: T;
}

interface DropDownProps<T> {
    buttonClass?: string;
    currentValue: T;
    options: DropDownOption<T>[];
    onSelect: (value: T) => void;
}

const menuMargin = 8;

function DropDown<T>(props: DropDownProps<T>) {
    const [menuPosition, setMenuPosition] = createSignal({
        x: 0,
        y: 0
    });
    const [isOpen, setOpenStatus] = createSignal(false);
    const label = createMemo(
        () => {
            const { label = '', value } =
                props.options.find(({ value }) => value === props.currentValue) || {};

            return label || String(value);
        },
        props.currentValue,
        { equals: (prev, next) => prev === next }
    );

    let trigger = undefined as HTMLButtonElement | undefined;
    let menu = undefined as HTMLUListElement | undefined;

    function closeOptions() {
        if (isOpen()) setOpenStatus(false);
    }

    function calculateMenuPosition() {
        if (trigger && menu) {
            const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
            const {
                x: triggerX,
                y: triggerY,
                width: triggerWidth,
                height: triggerHeight
            } = trigger.getBoundingClientRect();
            const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect();

            let x: number = triggerX;
            let y: number = triggerY;

            if (triggerX + triggerWidth + menuWidth > viewportWidth) {
                x += triggerWidth - menuWidth;
            }

            if (triggerY + triggerHeight + menuMargin + menuHeight > viewportHeight) {
                y -= menuMargin + menuHeight;
            } else {
                y += triggerHeight + menuMargin;
            }

            setMenuPosition({
                x,
                y
            });
        }
    }

    function toggleOptions() {
        setOpenStatus(!isOpen());
    }

    function handleOptionClick(value: T, isActiveItem: boolean) {
        return preventDefault(() => !isActiveItem && props.onSelect(value));
    }

    return (
        <>
            <button
                ref={trigger}
                class="h-8 px-2 flex items-center justify-between gap-2 transition-colors text-light-50 bg-primary-800 hover:bg-primary-700 rounded"
                classList={{
                    [props.buttonClass || '']: !!props.buttonClass,
                    'bg-primary-900 hover:bg-primary-800': !props.buttonClass
                }}
                type="button"
                onClick={stopPropagation(toggleOptions)}
                onBlur={closeOptions}
            >
                <span class="font-montserrat text-sm">{label()}</span>

                <Icon class="h-5 w-5" name="chevron-down" />
            </button>

            <Transition name="fade" onEnter={calculateMenuPosition}>
                <Show when={isOpen()}>
                    <ul
                        ref={menu}
                        class="fixed shadow min-w-48"
                        style={{ left: `${menuPosition().x}px`, top: `${menuPosition().y}px` }}
                    >
                        <For each={props.options}>
                            {({ label, value }) => {
                                const isActiveItem = props.currentValue === value;

                                return (
                                    <li
                                        class="h-12 p-4 flex items-centerfont-montserrat text-light-50 text-sm transition-colors bg-primary-900 hover:bg-primary-800 cursor-pointer"
                                        classList={{
                                            'bg-primary-700': isActiveItem
                                        }}
                                        onClick={stopPropagation(
                                            handleOptionClick(value, isActiveItem)
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
        </>
    );
}

export default DropDown;
