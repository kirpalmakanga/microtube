import { FunctionComponent } from 'react';
import Button from '../Button';

interface Props {
    itemCount: number;
    onClickClose: () => void;
    onClickImport: () => void;
    onClickClear: () => void;
}

const QueueHeader: FunctionComponent<Props> = ({
    itemCount,
    onClickClose,
    onClickImport,
    onClickClear
}) => (
    <header className="layout__header shadow--2dp">
        <div className="layout__header-row">
            <Button
                className="navigation__link layout__back-button icon-button"
                aria-label="Close queue"
                onClick={onClickClose}
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
                    onClick={onClickImport}
                    aria-label="Import videos"
                    icon="add"
                />

                <Button
                    className="navigation__link icon-button"
                    onClick={onClickClear}
                    aria-label="Clear queue"
                    icon="delete"
                />
            </nav>
        </div>
    </header>
);

export default QueueHeader;
