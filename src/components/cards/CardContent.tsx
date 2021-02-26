import { FunctionComponent } from 'react';

interface Props {
    onClick: () => void;
}

const CardContent: FunctionComponent<Props> = ({ children, ...props }) => (
    <div className="card__content" {...props}>
        {children}
    </div>
);

export default CardContent;
