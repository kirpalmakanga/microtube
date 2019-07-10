import React from 'react';

const CardContent = ({ children, ...props }) => (
    <div className="card__content" {...props}>
        {children}
    </div>
);

export default CardContent;
