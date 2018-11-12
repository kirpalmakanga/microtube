import React, { Component } from 'react';

const Icon = ({ className = '', name = '' }) =>
  name ? (
    <span className={['icon', className].join(' ')}>
      <svg>
        <use xlinkHref={`#icon-${name}`} />
      </svg>
    </span>
  ) : null;

export default Icon;
