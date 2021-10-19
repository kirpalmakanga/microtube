import { Component, JSX, JSXElement, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Transition } from 'solid-transition-group';

import { MenuItemData } from './types';

import Menu from './Menu';
import MenuItem from './MenuItem';
import { Dynamic } from 'solid-js/web';

export type MenuOpener = (callbackData: State, menuTitle: string) => void;

interface Props {
    menuItems: MenuItemData[];
    children: JSX.FunctionElement;
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

const MenuWrapper: Component<Props> = (props) => {
    const [state, setState] = createStore(initialState);

    const open: MenuOpener = (callbackData: State, menuTitle: string) => {
        if (state.isMenuOpen) {
            return;
        }

        setState({ isMenuOpen: true, menuTitle, callbackData });
    };

    const close = () => setState({ isMenuOpen: false });

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
