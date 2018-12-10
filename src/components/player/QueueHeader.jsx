import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Button from '../Button';

import { queueVideos } from '../../actions/youtube';

import { parseID, splitLines } from '../../lib/helpers';

class QueueHeader extends PureComponent {
    render() {
        const {
            player,
            closeQueue,
            promptAddVideo,
            promptClearQueue
        } = this.props;

        return (
            <header className="layout__header queue__header">
                <div className="layout__header-row">
                    <Button
                        className="navigation__link layout__back-button icon-button"
                        title="Close queue"
                        onClick={closeQueue}
                        icon="chevron-down"
                    />

                    <span className="layout-title">
                        {`Queue (${player.queue.length} Items)`}
                    </span>

                    <nav className="navigation">
                        <Button
                            className="navigation__link icon-button"
                            onClick={promptAddVideo}
                            title="Add video"
                            icon="add"
                        />

                        <Button
                            className="navigation__link icon-button"
                            onClick={promptClearQueue}
                            title="Clear queue"
                            icon="clear"
                        />
                    </nav>
                </div>
            </header>
        );
    }
}

const mapStateToProps = ({ player }) => ({ player });

const mapDispatchToProps = (dispatch) => ({
    closeQueue: () => dispatch({ type: 'QUEUE_CLOSE' }),
    promptAddVideo: () =>
        dispatch({
            type: 'prompt/OPEN',
            data: {
                promptText: 'Import videos',
                confirmText: 'Import',
                form: true,
                callback: async (text) => {
                    const ids = splitLines(text);

                    if (!ids.length) {
                        return;
                    }

                    await dispatch(queueVideos(ids.map(parseID)));
                    dispatch({ type: 'prompt/CLOSE' });
                }
            }
        }),
    promptClearQueue: () =>
        dispatch({
            type: 'prompt/OPEN',
            data: {
                promptText: 'Clear the queue ?',
                confirmText: 'Clear',
                callback: () => {
                    dispatch({ type: 'QUEUE_CLEAR' });
                    dispatch({ type: 'prompt/CLOSE' });
                }
            }
        })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QueueHeader);
