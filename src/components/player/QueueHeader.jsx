import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Button from '../Button';

class QueueHeader extends PureComponent {
  render() {
    const { player, closeQueue, promptAddVideo, promptClearQueue } = this.props;

    return (
      <div className='queue__header'>
        <div class='layout__header-row'>
          <Button
            className='layout__back-button icon-button'
            title='Close queue'
            onClick={closeQueue}
            icon='chevron-down'
          />

          <span className='layout-title'>
            {'Queue (' + player.queue.length + ' Items)'}
          </span>

          <nav className='navigation'>
            <Button
              className='navigation__link icon-button'
              onClick={promptAddVideo}
              title='Add video'
              icon='add'
            />

            <Button
              className='navigation__link icon-button'
              onClick={promptClearQueue}
              title='Clear queue'
              icon='clear'
            />
          </nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ player }) => ({ player });

const mapDispatchToProps = (dispatch) => ({
  closeQueue: () => dispatch({ type: 'QUEUE_CLOSE' }),
  promptAddVideo: () =>
    dispatch({
      type: 'PROMPT',
      data: {
        promptText: 'Ajouter une vidéo',
        confirmText: 'Ajouter',
        form: true,
        callback: () => {
          dispatch({ type: 'PROMPT_CLOSE' });
        }
      }
    }),
  promptClearQueue: () =>
    dispatch({
      type: 'PROMPT',
      data: {
        promptText: "Vider la file d'attente ?",
        confirmText: 'Vider',
        callback: () => {
          dispatch({ type: 'QUEUE_CLEAR' });
          dispatch({ type: 'PROMPT_CLOSE' });
        }
      }
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueueHeader);
