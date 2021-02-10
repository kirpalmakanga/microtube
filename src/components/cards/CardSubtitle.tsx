import { FunctionComponent } from 'react';

interface Props {
    className: string;
}

const CardTitle: FunctionComponent<Props> = ({
    children,
    className,
    ...props
}) => (
    <h3 className={['card__subtitle', className].join(' ')} {...props}>
        {children}
    </h3>
);

export default CardTitle;
