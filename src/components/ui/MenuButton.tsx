import { Component, createSignal } from 'solid-js';
import Menu, { MenuItemData } from './Menu';
import Button from './Button';

interface MenuButtonProps {
    items: MenuItemData[];
}

const MenuButton: Component<MenuButtonProps> = (props) => {
    const [isMenuVisible, setIsMenuVisible] = createSignal<boolean>(false);

    function openMenu() {
        setIsMenuVisible(true);
    }

    function closeMenu() {
        setIsMenuVisible(false);
    }

    return (
        <>
            <Button
                class="flex items-center justify-center transition-colors text-light-50 hover:text-opacity-50 p-2"
                icon="more"
                iconClass="w-5 h-5"
                onClick={openMenu}
            />

            <Menu isVisible={isMenuVisible()} items={props.items} onClickClose={closeMenu} />
        </>
    );
};

export default MenuButton;
