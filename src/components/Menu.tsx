import { For, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { stopPropagation } from '../lib/helpers';
import { useMenu } from '../store/menu';
import { AlertColor, MenuItemData } from '../store/menu/_state';
import Icon from './Icon';

const menuItemColors: Record<AlertColor, string> = {
    error: 'text-red-400',
    success: '',
    warning: ''
};

function getItemColor(code?: AlertColor) {
    return code ? menuItemColors[code] : '';
}

const Menu = () => {
    const [menu, { closeMenu }] = useMenu();

    return (
        <>
            <Transition name="fade">
                <Show when={menu.isOpen}>
                    <div class="fixed inset-0 bg-primary-900 bg-opacity-50 cursor-pointer z-10"></div>
                </Show>
            </Transition>

            <Transition name="slide-up">
                <Show when={menu.isOpen}>
                    <div
                        class="fixed inset-0 flex flex-col <md:justify-end md:(justify-center items-center) shadow z-10 p-4"
                        onClick={closeMenu}
                    >
                        <div class="bg-primary-900 shadow  max-w-full rounded p-4">
                            <Show when={menu.title}>
                                <div
                                    class="p-4 bg-primary-900 text-light-50 font-montserrat"
                                    onClick={stopPropagation()}
                                >
                                    {menu.title}
                                </div>
                            </Show>

                            <ul class="flex flex-col gap-2">
                                <For each={menu.items}>
                                    {({ title, icon, color, onClick }: MenuItemData) => (
                                        <li class="flex">
                                            <button
                                                class="flex items-center gap-4 flex-grow bg-primary-800 hover:bg-primary-700 text-light-50 text-sm transition-colors font-montserrat p-4 rounded"
                                                classList={{
                                                    [getItemColor(color)]: !!color
                                                }}
                                                type="button"
                                                onClick={() => {
                                                    closeMenu();
                                                    onClick(menu.callbackData);
                                                }}
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
                        </div>
                    </div>
                </Show>
            </Transition>
        </>
    );
};

export default Menu;
