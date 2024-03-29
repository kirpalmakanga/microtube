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
                    <div class="menu__overlay" onClick={closeMenu}></div>
                </Show>
            </Transition>

            <Transition name="slide-up">
                <Show when={menu.isOpen}>
                    <div class="menu__container shadow--2dp">
                        <Show when={menu.title}>
                            <div
                                class="menu__header"
                                onClick={stopPropagation()}
                            >
                                {menu.title}
                            </div>
                        </Show>

                        <ul class="menu__items">
                            <For each={menu.items}>
                                {({ title, icon, onClick }: MenuItemData) => (
                                    <li>
                                        <button
                                            class="menu__item"
                                            type="button"
                                            onClick={() => {
                                                closeMenu();
                                                onClick(menu.callbackData);
                                            }}
                                        >
                                            <Show when={icon}>
                                                <Icon name={icon} />
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
