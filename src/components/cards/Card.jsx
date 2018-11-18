import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { getThumbnails } from '../../lib/helpers';

import Img from '../Img';
import Button from '../Button';

class Card extends PureComponent {
  render() {
    const {
      href,
      onClick = () => {},
      title,
      thumbnails,
      badge = '',
      subTitles = [],
      buttons = []
    } = this.props;

    const Clickable = href
      ? Link
      : ({ children, ...props }) => <div {...props}>{children}</div>;

    return (
      <div className='card'>
        <Clickable
          className='card__content'
          to={href}
          onClick={onClick}
          aria-label={title}
        >
          <div className='card__thumb'>
            {thumbnails ? (
              <Img
                src={getThumbnails(thumbnails, 'high')}
                alt={title}
                background
              />
            ) : null}

            {badge ? <span className='card__thumb-badge'>{badge}</span> : null}
          </div>

          <div className='card__text'>
            <h2 className='card__text-title'>{title}</h2>
            {subTitles.length
              ? subTitles.map((text, index) => (
                  <div key={index} className='card__text-subtitle'>
                    {text}
                  </div>
                ))
              : null}
          </div>
        </Clickable>

        {buttons.length ? (
          <div className='card__buttons'>
            {buttons.map((props, index) => (
              <Button
                key={index}
                className='card__button icon-button'
                {...props}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Card;
