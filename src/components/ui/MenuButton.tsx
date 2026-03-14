import { Component } from 'solid-js';
import Menu, { MenuItemData } from './Menu';
import Button from './Button';

interface MenuButtonProps {
    title?: string;
    items: MenuItemData[];
}

const MenuButton: Component<MenuButtonProps> = (props) => {
    return (
        <Menu items={props.items}>
            {(openMenu) => (
                <Button
                    class="flex items-center justify-center transition-colors text-light-50 hover:text-opacity-50 p-2"
                    icon="more"
                    iconClass="w-5 h-5"
                    onClick={openMenu}
                />
            )}
        </Menu>
    );
};

export default MenuButton;
