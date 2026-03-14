import { Component, createSignal } from 'solid-js';
import IconButton from '../ui/IconButton';
import PlayerVideoImportModal from './PlayerVideoImportModal';

interface Props {
    itemCount: number;
    onClickClose: () => void;
    onClickClear: () => void;
}

const QueueHeader: Component<Props> = (props) => {
    const [isImportFormVisible, setIsImportFormVisible] = createSignal<boolean>(false);

    function openImportForm() {
        setIsImportFormVisible(true);
    }

    function closeImportForm() {
        setIsImportFormVisible(false);
    }

    return (
        <>
            <header class="flex items-center h-12 bg-primary-900 shadow">
                <span class="flex-grow overflow-hidden px-4">
                    <span class="font-montserrat overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {`Queue (${props.itemCount} item${props.itemCount > 1 ? 's' : ''})`}
                    </span>
                </span>

                <nav class="flex px-4 gap-2">
                    <IconButton icon="add" onClick={openImportForm} />

                    <IconButton icon="delete" onClick={props.onClickClear} />

                    <IconButton
                        class="bg-red-500 hover:bg-red-400"
                        icon="close"
                        onClick={props.onClickClose}
                    />
                </nav>
            </header>

            <PlayerVideoImportModal
                isVisible={isImportFormVisible()}
                onClickClose={closeImportForm}
            />
        </>
    );
};

export default QueueHeader;
