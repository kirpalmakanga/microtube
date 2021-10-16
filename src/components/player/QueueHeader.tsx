import { Component } from 'solid-js';
import Button from '../Button';

interface Props {
    itemCount: number;
    onClickClose: () => void;
    onClickImport: () => void;
    onClickClear: () => void;
}

const QueueHeader: Component<Props> = (props) => (
    <header className="layout__header shadow--2dp">
        <div className="layout__header-row">
            <Button
                className="navigation__link layout__back-button icon-button"
                aria-label="Close queue"
                onClick={props.onClickClose}
                icon="chevron-down"
            />

            <span className="layout__title">
                <span className="layout__title-inner">
                    {`Queue (${props.itemCount} item${
                        props.itemCount > 1 ? 's' : ''
                    })`}
                </span>
            </span>

            <nav className="navigation">
                <Button
                    className="navigation__link icon-button"
                    onClick={props.onClickImport}
                    aria-label="Import videos"
                    icon="add"
                />

                <Button
                    className="navigation__link icon-button"
                    onClick={props.onClickClear}
                    aria-label="Clear queue"
                    icon="delete"
                />
            </nav>
        </div>
    </header>
);

export default QueueHeader;
