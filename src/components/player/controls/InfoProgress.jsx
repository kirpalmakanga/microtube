import { PureComponent } from 'react';

class Progress extends PureComponent {
  formatPercent = progress => parseFloat(progress * 100 - 100).toFixed(2);

  render() {
    const {
      props: { percentElapsed, percentLoaded },
      formatPercent
    } = this;

    return (
      <div className='player__info-progress'>
        <div className='player__info-progress-gutter'>
          <div
            className='player__info-progress-loaded'
            style={{
              transform: `translateX(${formatPercent(percentLoaded)}%)`
            }}
          />
          <div
            className='player__info-progress-played'
            style={{
              transform: `translateX(${formatPercent(percentElapsed)}%)`
            }}
          />
        </div>
      </div>
    );
  }
}

export default Progress;
