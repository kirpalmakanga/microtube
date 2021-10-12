import { Component, For, JSXElement } from 'solid-js';
import { stopPropagation } from '../../lib/helpers';

import { MenuItemData } from './types';

interface Props {
    title: string;
    onClick: () => void;
    items: MenuItemData[];
    renderItem: (data: MenuItemData) => JSXElement;
}

const Menu: Component<Props> = ({ title, items, onClick, renderItem }) => (
    <div className="menu" onClick={onClick}>
        <div className="menu__container  shadow--2dp">
            {title ? (
                <div className="menu__header" onClick={stopPropagation()}>
                    {title}
                </div>
            ) : null}

            <ul className="menu__items">
                <For each={items}>
                    {(data: MenuItemData) => <li>{renderItem(data)}</li>}
                </For>
            </ul>
        </div>
    </div>
);

export default Menu;
