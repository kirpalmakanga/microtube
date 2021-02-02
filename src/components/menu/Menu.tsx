import { FunctionComponent, ReactNode, ReactNodeArray } from 'react';
import Fade from '../animations/Fade';
import { stopPropagation } from '../../lib/helpers';

interface Props {
    title: string;
    isVisible: boolean;
    onClick: () => void;
    children: ReactNodeArray;
}

const Menu: FunctionComponent<Props> = ({
    title,
    isVisible = false,
    onClick,
    children = []
}) => (
    <Fade in={isVisible}>
        <div className="menu" onClick={onClick}>
            <div className="menu__container  shadow--2dp">
                {title ? (
                    <div className="menu__header" onClick={stopPropagation()}>
                        {title}
                    </div>
                ) : null}

                <ul className="menu__items">
                    {children.map((child: ReactNode) => (
                        <li>{child}</li>
                    ))}
                </ul>
            </div>
        </div>
    </Fade>
);

export default Menu;
