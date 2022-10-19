import { Component } from 'solid-js';
import Button from '../Button';
import Icon from '../Icon';

interface Props {
    itemCount: number;
    onClickClose: () => void;
    onClickImport: () => void;
    onClickClear: () => void;
}

const QueueHeader: Component<Props> = (props) => (
    <header class="flex items-center h-12 bg-primary-900 shadow z-1">
        <Button
            class="group relative flex items-center justify-center h-12 w-12 bg-primary-900"
            onClick={props.onClickClose}
        >
            <Icon
                class="text-light-50 group-hover:text-opacity-50 transition-colors w-6 h-6"
                name="chevron-down"
            />
        </Button>

        <span class="flex-grow overflow-hidden">
            <span class="font-montserrat overflow-ellipsis overflow-hidden whitespace-nowrap">
                {`Queue (${props.itemCount} item${
                    props.itemCount > 1 ? 's' : ''
                })`}
            </span>
        </span>

        <nav class="flex">
            <Button
                class="group relative flex items-center justify-center h-12 w-12 bg-primary-900"
                onClick={props.onClickImport}
            >
                <Icon
                    class="text-light-50 group-hover:text-opacity-50 transition-colors w-6 h-6"
                    name="add"
                />
            </Button>

            <Button
                class="group relative flex items-center justify-center h-12 w-12 bg-primary-900"
                onClick={props.onClickClear}
            >
                <Icon
                    class="text-light-50 group-hover:text-opacity-50 transition-colors w-6 h-6"
                    name="delete"
                />
            </Button>
        </nav>
    </header>
);

export default QueueHeader;
