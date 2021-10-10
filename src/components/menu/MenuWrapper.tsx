import { Component, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';

import Menu from './Menu';
import MenuItem from './MenuItem';

interface MenuItemData {
    title: string;
    icon: string;
    onClick: (callbackData: object) => void;
}

interface Props {
    menuItems: MenuItemData[];
    children: (openMenu: Function) => Element[] | Element;
}

interface State {
    isMenuOpen: boolean;
    menuTitle: string;
    callbackData: object;
}

const initialState: State = {
    isMenuOpen: false,
    menuTitle: '',
    callbackData: {}
};

const MenuWrapper: Component<Props> = ({ menuItems, children = () => {} }) => {
    const [{ isMenuOpen, menuTitle, callbackData }, setState] =
        createStore(initialState);

    const openMenu = (callbackData: State, menuTitle: string) => {
        if (isMenuOpen) {
            return;
        }

        setState({ isMenuOpen: true, menuTitle, callbackData });
    };

    const closeMenu = () => setState({ isMenuOpen: false });

    return (
        <>
            {children(openMenu)}

            <Transition name="slide-up">
                <Show when={isMenuOpen}>
                    <Menu
                        onClick={closeMenu}
                        title={menuTitle}
                        items={menuItems}
                        renderItem={({
                            title,
                            icon,
                            onClick
                        }: MenuItemData) => (
                            <MenuItem
                                key={title}
                                title={title}
                                icon={icon}
                                onClick={() => onClick(callbackData)}
                            />
                        )}
                    />
                </Show>
            </Transition>
        </>
    );
};

export default MenuWrapper;
