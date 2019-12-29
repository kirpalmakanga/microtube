import { PureComponent } from 'react';

import Menu from './Menu';
import MenuItem from './MenuItem';

class MenuWrapper extends PureComponent {
    state = { isMenuOpen: false, menuTitle: '', menuData: {} };

    openMenu = (menuData = {}, menuTitle = '') =>
        this.setState({ isMenuOpen: true, menuTitle, menuData });

    closeMenu = () => this.setState({ isMenuOpen: false, menuData: {} });

    render() {
        const {
            props: { menuItems = [], children = () => {} },
            state: { isMenuOpen, menuData, menuTitle },
            openMenu,
            closeMenu
        } = this;

        return (
            <>
                {children(openMenu)}

                <Menu
                    isVisible={isMenuOpen}
                    onClick={closeMenu}
                    title={menuTitle}
                >
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
