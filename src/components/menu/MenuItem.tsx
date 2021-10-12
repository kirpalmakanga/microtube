import { Component } from 'solid-js';
import Icon from '../Icon';
import { MenuItemData } from './types';

interface Props {
    title: string;
    icon: string;
    onClick: () => void;
}

const MenuItem: Component<Props> = ({ title, icon, onClick }: MenuItemData) => (
    <button className="menu__item" type="button" onClick={onClick}>
        {icon ? <Icon name={icon} /> : null}

        <span>{title}</span>
    </button>
);

export default MenuItem;
