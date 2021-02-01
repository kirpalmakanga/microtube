import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';

import {
    clearQueue,
    toggleQueue,
    importVideos
} from '../../store/actions/youtube';

const QueueHeader = () => {
    const dispatch = useDispatch();
    const itemCount = useSelector(({ player: { queue } }) => queue.length);

    const handleToggleQueue = () => dispatch(toggleQueue());
    const handleImportVideos = () => dispatch(importVideos());
    const handleClearQueue = () => dispatch(clearQueue());

    return (
        <header className="layout__header queue__header shadow--2dp">
            <div className="layout__header-row">
                <Button
                    className="navigation__link layout__back-button icon-button"
                    title="Close queue"
                    onClick={handleToggleQueue}
                    icon="chevron-down"
                />

                <span className="layout__title">
                    <span className="layout__title-inner">
                        {`Queue (${itemCount} item${itemCount > 1 ? 's' : ''})`}
                    </span>
                </span>

                <nav className="navigation">
                    <Button
                        className="navigation__link icon-button"
                        onClick={handleImportVideos}
                        title="Import videos"
                        icon="add"
                    />

                    <Button
                        className="navigation__link icon-button"
                        onClick={handleClearQueue}
                        title="Clear queue"
                        icon="delete"
                    />
                </nav>
            </div>
        </header>
    );
};

export default QueueHeader;
