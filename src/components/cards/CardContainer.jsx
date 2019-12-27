import React from 'react';

const CardContainer = ({ children, ...props }) => (
    <div className="card" {...props}>
        {children}
    </div>
);

export default CardContainer;
