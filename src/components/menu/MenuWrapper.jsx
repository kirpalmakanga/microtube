import React, { PureComponent } from 'react';

import Menu from './Menu';
import MenuItem from './MenuItem';

class MenuWrapper extends PureComponent {
    state = { isMenuOpen: false, menuData: {} };

    openMenu = (menuData = {}) => this.setState({ isMenuOpen: true, menuData });

    closeMenu = () => this.setState({ isMenuOpen: false, menuData: {} });

    render() {
        const {
            props: { menuItems = [], children = () => {} },
            state: { isMenuOpen, menuData },
            openMenu,
            closeMenu
        } = this;

        return (
            <>
                {children(openMenu)}

                <Menu isVisible={isMenuOpen} onClick={closeMenu}>
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
    }
}

export default MenuWrapper;
