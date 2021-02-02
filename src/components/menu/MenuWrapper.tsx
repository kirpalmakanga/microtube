import { useReducer, useState, useCallback, FunctionComponent } from 'react';

import Menu from './Menu';
import MenuItem from './MenuItem';

interface MenuItemData {
    title: string
    icon: string
    onClick: (callbackData: object) => void
}

interface Props {
    menuItems: MenuItemData[]
    children: (openMenu: Function) => Element | Element[]
}

interface State {
    isMenuOpen: boolean
    menuTitle: string
    callbackData: object
}

const initialState: State = {
    isMenuOpen: false,
    menuTitle: '',
    callbackData: {}
};

const MenuWrapper: FunctionComponent<Props> = ({ menuItems, children }) => {
    const [{ isMenuOpen, menuTitle, callbackData }, setState] = useReducer(
        (state: State, newState: object) => ({ ...state, ...newState }),
        initialState
    );

    const openMenu = useCallback(
        (callbackData: State, menuTitle: string) => {
            if (isMenuOpen) {
                return;
            }

            setState({ isMenuOpen: true, menuTitle, callbackData });
        },
        [isMenuOpen]
    );

    const closeMenu = useCallback(() => {
        setState({ isMenuOpen: false });
    }, [isMenuOpen]);

    return (
        <>
            {children(openMenu)}

            <Menu isVisible={isMenuOpen} onClick={closeMenu} title={menuTitle}>
                {menuItems.map(({ title, icon, onClick }: MenuItemData) => (
                    <MenuItem
                        key={title}
                        title={title}
                        icon={icon}
                        onClick={() => onClick(callbackData)}
                    />
                ))}
            </Menu>
        </>
    );
};

export default MenuWrapper;
