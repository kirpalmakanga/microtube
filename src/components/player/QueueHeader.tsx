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
    <header class="flex items-center h-12 bg-primary-900 shadow">
        <span class="flex-grow overflow-hidden px-4">
            <span class="font-montserrat overflow-ellipsis overflow-hidden whitespace-nowrap">
                {`Queue (${props.itemCount} item${
                    props.itemCount > 1 ? 's' : ''
                })`}
            </span>
        </span>

        <nav class="flex px-4 gap-2">
            <Button
                class="group relative flex items-center justify-center h-8 w-8 rounded bg-primary-800 hover:bg-primary-700 transition-colors"
                onClick={props.onClickImport}
            >
                <Icon class="text-light-50 w-5 h-5" name="add" />
            </Button>

            <Button
                class="group relative flex items-center justify-center h-8 w-8 rounded bg-primary-800 hover:bg-primary-700 transition-colors"
                onClick={props.onClickClear}
            >
                <Icon class="text-light-50 w-5 h-5" name="delete" />
            </Button>

            <Button
                class="group relative flex items-center justify-center h-8 w-8 rounded bg-primary-800 bg-red-500 hover:bg-red-400 transition-colors"
                onClick={props.onClickClose}
            >
                <Icon class="text-light-50 w-5 h-5 " name="close" />
            </Button>
        </nav>
    </header>
);

export default QueueHeader;
