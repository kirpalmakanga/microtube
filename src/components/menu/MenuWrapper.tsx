import { JSXElement, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';

import { MenuItemData } from './types';

import Menu from './Menu';
import MenuItem from './MenuItem';
import { Dynamic } from 'solid-js/web';
import { delay } from '../../lib/helpers';

interface Props {
    menuItems: MenuItemData[];
    children: (props: { openMenu: MenuOpener }) => JSXElement;
}

interface State {
    isMenuOpen: boolean;
    menuTitle: string;
    callbackData: Object;
}

export type MenuOpener = (callbackData: State, menuTitle: string) => void;

const initialState: State = {
    isMenuOpen: false,
    menuTitle: '',
    callbackData: {}
};

const MenuWrapper = (props: Props) => {
    const [state, setState] = createStore(initialState);

    const open: MenuOpener = (callbackData: State, menuTitle: string) => {
        if (state.isMenuOpen) {
            return;
        }

        setState({ isMenuOpen: true, menuTitle, callbackData });
    };

    const close = async () => {
        setState({ isMenuOpen: false });

        await delay(300);

        setState(initialState);
    };

    return (
        <>
            <Dynamic component={props.children} openMenu={open} />

            <Transition name="fade">
                <Show when={state.isMenuOpen}>
                    <Menu
                        onClick={close}
                        title={state.menuTitle}
                        items={props.menuItems}
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
