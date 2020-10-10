import { useState } from 'react';

import Menu from './Menu';
import MenuItem from './MenuItem';

const initialState = {
    isMenuOpen: false,
    menuTitle: '',
    menuData: {}
};

const MenuWrapper = ({ menuItems = [], children = () => {} }) => {
    const [{ isMenuOpen, menuTitle, menuData }, setState] = useState(
        initialState
    );

    const openMenu = (menuData = {}, menuTitle = '') => {
        if (isMenuOpen) {
            return;
        }

        setState({ isMenuOpen: true, menuTitle, menuData });
    };

    const closeMenu = () => setState(initialState);

    return (
        <>
            {children(openMenu)}

            <Menu isVisible={isMenuOpen} onClick={closeMenu} title={menuTitle}>
                {menuItems.map(({ title, icon, onClick } = {}, i) => (
                    <MenuItem
                        key={i}
                        title={title}
                        icon={icon}
                        onClick={() => onClick(menuData)}
                    />
                ))}
            </Menu>
        </>
    );
};

export default MenuWrapper;
