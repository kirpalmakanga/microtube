import { Component, For, Show } from 'solid-js';
import Icon from '../Icon';
import Modal from './Modal';

export type AlertColor = 'error' | 'warning' | 'success';

const menuItemColors: Record<AlertColor, string> = {
    error: 'text-red-400',
    success: '',
    warning: ''
};

function getItemColor(code?: AlertColor) {
    return code ? menuItemColors[code] : '';
}

export interface MenuItemData {
    title: string;
    icon: string;
    onClick: (...args: any[]) => void;
    color?: AlertColor;
}

interface MenuProps {
    title: string;
    items: MenuItemData[];
    isVisible: boolean;
    onClickClose: () => void;
}

const Menu: Component<MenuProps> = (props) => {
    function handeClick(callback: () => void) {
        return () => {
            callback();

            props.onClickClose();
        };
    }

    return (
        <Modal title={props.title} isVisible={props.isVisible} onClickClose={props.onClickClose}>
            <ul class="flex flex-col gap-2">
                <For each={props.items}>
                    {({ title, icon, color, onClick }: MenuItemData) => (
                        <li class="flex">
                            <button
                                class="flex items-center gap-4 flex-grow bg-primary-800 hover:bg-primary-700 text-light-50 text-sm transition-colors font-montserrat p-4 rounded"
                                classList={{
                                    [getItemColor(color)]: !!color
                                }}
                                type="button"
                                onClick={handeClick(onClick)}
                            >
                                <Show when={icon}>
                                    <Icon class="h-5 w-5" name={icon} />
                                </Show>

                                <span>{title}</span>
                            </button>
                        </li>
                    )}
                </For>
            </ul>
        </Modal>
    );
};

export default Menu;
