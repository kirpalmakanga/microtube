const Menu = ({ onClick = () => {}, children = [] }) => (
    <div class="menu" onClick={onClick}>
        <ul class="menu__items shadow--2dp">
            {children.map((child) => (
                <li>{child}</li>
            ))}
        </ul>
    </div>
);

export default Menu;
