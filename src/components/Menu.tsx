import { For, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { stopPropagation } from '../lib/helpers';
import { useMenu } from '../store/menu';
import { MenuItemData } from '../store/menu/_state';
import Icon from './Icon';

const Menu = () => {
    const [menu, { closeMenu }] = useMenu();

    return (
        <>
            <Transition name="fade">
                <Show when={menu.isOpen}>
                    <div
                        class="fixed inset-0 bg-primary-900 bg-opacity-50 cursor-pointer z-10"
                        onClick={closeMenu}
                    ></div>
                </Show>
            </Transition>

            <Transition name="slide-up">
                <Show when={menu.isOpen}>
                    <div class="fixed left-0 right-0 bottom-0 shadow z-10">
                        <Show when={menu.title}>
                            <div
                                class="p-4 bg-primary-900 text-light-50 font-montserrat"
                                onClick={stopPropagation()}
                            >
                                {menu.title}
                            </div>
                        </Show>

                        <ul class="menu__items">
                            <For each={menu.items}>
                                {({ title, icon, onClick }: MenuItemData) => (
                                    <li class="flex border-t-1 border-primary-700">
                                        <button
                                            class="flex items-center gap-4 flex-grow bg-primary-800 hover:bg-primary-700 text-light-50 transition-colors font-montserrat p-4"
                                            type="button"
                                            onClick={() => {
                                                closeMenu();
                                                onClick(menu.callbackData);
                                            }}
                                        >
                                            <Show when={icon}>
                                                <Icon
                                                    class="h-6 w-6"
                                                    name={icon}
                                                />
                                            </Show>

                                            <span>{title}</span>
                                        </button>
                                    </li>
                                )}
                            </For>
                        </ul>
                    </div>
                </Show>
            </Transition>
        </>
    );
};

export default Menu;
