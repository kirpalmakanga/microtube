import Icon from '../Icon';

const MenuItem = ({ title = '', icon = '', onClick = () => {} }) => (
    <button className="menu__item" type="button" onClick={onClick}>
        {icon ? <Icon name={icon} /> : null}

        <span>{title}</span>
    </button>
);

export default MenuItem;
