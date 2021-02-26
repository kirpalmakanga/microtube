import { FunctionComponent } from 'react';

const CardContentInner: FunctionComponent = ({ children }) => (
    <div className="card__text">{children}</div>
);

export default CardContentInner;
