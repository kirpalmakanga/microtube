import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Button from '../Button';

import { prompt, queueVideos } from '../../actions/youtube';

import { parseID, splitLines, chunk } from '../../lib/helpers';

class QueueHeader extends PureComponent {
    render() {
        const {
            player,
            closeQueue,
            promptAddVideo,
            promptClearQueue
        } = this.props;

        return (
            <header className="layout__header queue__header shadow--2dp">
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
        dispatch(
            prompt({
                promptText: 'Import videos',
                confirmText: 'Import',
                form: true,
                callback: async (text) => {
                    const ids = splitLines(text);

                    if (!ids.length) {
                        return;
                    }

                    const chunks = chunk(ids, 50);

                    for (let i = 0; i < chunks.length; i++) {
                        const chunk = chunks[i];

                        await dispatch(queueVideos(chunk.map(parseID)));
                    }
                }
            })
        ),

    promptClearQueue: () =>
        dispatch(
            prompt({
                promptText: 'Clear the queue ?',
                confirmText: 'Clear',
                callback: async () => {
                    dispatch({ type: 'QUEUE_CLEAR' });
                }
            })
        )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QueueHeader);
