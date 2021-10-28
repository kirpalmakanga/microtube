import { stopPropagation } from '../lib/helpers';
import { useMenu } from '../store/hooks/menu';
import { Transition } from 'solid-transition-group';
import { For, Show } from 'solid-js';
import { MenuItemData } from '../store/state/_menu';
import Icon from './Icon';

const Menu = () => {
    const [menu, { closeMenu }] = useMenu();

    return (
        <Transition name="fade">
            <Show when={menu.isOpen}>
                <div className="menu" onClick={closeMenu}>
                    <div className="menu__container  shadow--2dp">
                        <Show when={menu.title}>
                            <div
                                className="menu__header"
                                onClick={stopPropagation()}
                            >
                                {menu.title}
                            </div>
                        </Show>

                        <ul className="menu__items">
                            <For each={menu.items}>
                                {({ title, icon, onClick }: MenuItemData) => (
                                    <li>
                                        <button
                                            className="menu__item"
                                            type="button"
                                            onClick={() =>
                                                onClick(menu.callbackData)
                                            }
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
                </div>
            </Show>
        </Transition>
    );
};

export default Menu;
