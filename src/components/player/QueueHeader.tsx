import { Component } from 'solid-js';
import Button from '../Button';

interface Props {
    itemCount: number;
    onClickClose: () => void;
    onClickImport: () => void;
    onClickClear: () => void;
}

const QueueHeader: Component<Props> = (props) => (
    <header class="layout__header shadow--2dp">
        <div class="layout__header-row">
            <Button
                class="navigation__link layout__back-button icon-button"
                aria-label="Close queue"
                onClick={props.onClickClose}
                icon="chevron-down"
            />

            <span class="layout__title">
                <span class="layout__title-inner">
                    {`Queue (${props.itemCount} item${
                        props.itemCount > 1 ? 's' : ''
                    })`}
                </span>
            </span>

            <nav class="navigation">
                <Button
                    class="navigation__link icon-button"
                    onClick={props.onClickImport}
                    aria-label="Import videos"
                    icon="add"
                />

                <Button
                    class="navigation__link icon-button"
                    onClick={props.onClickClear}
                    aria-label="Clear queue"
                    icon="delete"
                />
            </nav>
        </div>
    </header>
);

export default QueueHeader;
