import { FunctionComponent } from 'react';
import Button from '../Button';

import { usePlayer } from '../../store/hooks/player';

const QueueHeader: FunctionComponent = () => {
    const [, { clearQueue }] = usePlayer();
    const [
        {
            queue: { length: itemCount }
        },
        { importVideos, toggleQueue }
    ] = usePlayer();

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
                        {`Queue (${itemCount} item${itemCount > 1 ? 's' : ''})`}
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
                        icon="delete"
                    />
                </nav>
            </div>
        </header>
    );
};

export default QueueHeader;
