import { PureComponent } from 'react';
import { connect } from 'react-redux';

import Button from '../Button';

import { clearQueue, toggleQueue, importVideos } from '../../actions/youtube';

class QueueHeader extends PureComponent {
    render() {
        const {
            queueItemsCount,
            clearQueue,
            toggleQueue,
            importVideos
        } = this.props;

        return (
            <header className="layout__header queue__header shadow--2dp">
                <div className="layout__header-row">
                    <Button
                        className="navigation__link layout__back-button icon-button"
                        title="Close queue"
                        onClick={toggleQueue}
                        icon="chevron-down"
                    />

                    <span className="layout__title">
                        <span className="layout__title-inner">
                            {`Queue (${queueItemsCount} Items)`}
                        </span>
                    </span>

                    <nav className="navigation">
                        <Button
                            className="navigation__link icon-button"
                            onClick={importVideos}
                            title="Import videos"
                            icon="add"
                        />

                        <Button
                            className="navigation__link icon-button"
                            onClick={clearQueue}
                            title="Clear queue"
                            icon="clear"
                        />
                    </nav>
                </div>
            </header>
        );
    }
}

const mapStateToProps = ({ player: { queue } }) => ({
    queueItemsCount: queue.length
});

const mapDispatchToProps = {
    clearQueue,
    toggleQueue,
    importVideos
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QueueHeader);
