import { FunctionComponent} from 'react';
import Icon from '../Icon';

interface Props {
    title: string
    icon: string,
    onClick: () => void
}

const MenuItem: FunctionComponent<Props> = ({ title, icon, onClick }) => (
    <button className="menu__item" type="button" onClick={onClick}>
        {icon ? <Icon name={icon} /> : null}

        <span>{title}</span>
    </button>
);

export default MenuItem;
