import React from 'react';
import Card from './Card';

const CardContent = ({ children, ...props }) => (
    <div className="card__content" {...props}>
        {children}
    </div>
);

export default CardContent;
