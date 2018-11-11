import React, { Component } from 'react';

const Icon = ({ class: className = '', name = '' }) => (
    <span class={['icon', className].join(' ')}>
        <svg>
            <use xlinkHref={`#icon-${name}`} />
        </svg>
    </span>
);

export default Icon;
