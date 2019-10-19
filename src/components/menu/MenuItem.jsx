import Icon from '../Icon';

const MenuItem = ({ title = '', icon = '', onClick = () => {} }) => (
    <button class="menu__item" type="button" onClick={onClick}>
        <Icon name={icon} />

        <span>{title}</span>
    </button>
);

export default MenuItem;
