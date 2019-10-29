import Fade from '../animations/Fade';

const Menu = ({ isVisible, onClick = () => {}, children = [] }) => (
    <Fade in={isVisible}>
        <div className="menu" onClick={onClick}>
            <ul className="menu__items shadow--2dp">
                {children.map((child, i) => (
                    <li key={i}>{child}</li>
                ))}
            </ul>
        </div>
    </Fade>
);

export default Menu;
