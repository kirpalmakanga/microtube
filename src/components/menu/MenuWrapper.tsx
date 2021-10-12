import { Component, JSXElement, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';

import { MenuItemData } from './types';

import Menu from './Menu';
import MenuItem from './MenuItem';

interface Props {
    menuItems: MenuItemData[];
    children: (openMenu: Function) => JSXElement;
}

interface State {
    isMenuOpen: boolean;
    menuTitle: string;
    callbackData: Object;
}

const initialState: State = {
    isMenuOpen: false,
    menuTitle: '',
    callbackData: {}
};

const MenuWrapper: Component<Props> = ({ menuItems, children }) => {
    const [state, setState] = createStore(initialState);

    const openMenu = (callbackData: State, menuTitle: string) => {
        if (state.isMenuOpen) {
            return;
        }

        setState({ isMenuOpen: true, menuTitle, callbackData });
    };

    const closeMenu = () => setState({ isMenuOpen: false });

    return (
        <>
            {children(openMenu)}

            <Transition name="fade">
                <Show when={state.isMenuOpen}>
                    <Menu
                        onClick={closeMenu}
                        title={state.menuTitle}
                        items={menuItems}
                        renderItem={({
                            title,
                            icon,
                            onClick
                        }: MenuItemData) => (
                            <MenuItem
                                title={title}
                                icon={icon}
                                onClick={() => onClick(state.callbackData)}
                            />
                        )}
                    />
                </Show>
            </Transition>
        </>
    );
};

export default MenuWrapper;
