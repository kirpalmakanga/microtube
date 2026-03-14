import { Component, createSignal, JSX } from 'solid-js';
import Modal from '../ui/Modal';
import { usePlayer } from '../../store/player';
import {
    chunk,
    parseVideoId,
    preventDefault,
    splitLines,
    stopPropagation
} from '../../lib/helpers';
import Button from '../ui/Button';

interface PlayerVideoImportModalProps {
    isVisible: boolean;
    onClickClose: () => void;
}

const PlayerVideoImportModal: Component<PlayerVideoImportModalProps> = (props) => {
    const [, { queueVideos }] = usePlayer();

    const [text, setText] = createSignal('');

    const handleChange: JSX.EventHandler<HTMLTextAreaElement, Event> = ({
        currentTarget: { value }
    }) => {
        setText(value);
    };

    async function handleSubmit() {
        const lines = splitLines(text()).filter(Boolean);

        if (lines.length) {
            const videoIds = [...new Set(lines.map(parseVideoId))];

            const chunks = chunk(videoIds, 50);

            for (const ids of chunks) {
                await queueVideos(ids);
            }

            props.onClickClose();
        }
    }

    return (
        <Modal title="Import videos" isVisible={props.isVisible} onClickClose={props.onClickClose}>
            <form
                id="importVideos"
                class="flex flex-col flex-grow gap-4"
                onSubmit={preventDefault(handleSubmit)}
            >
                <textarea
                    id="videoId"
                    class="bg-primary-800 focus:(bg-primary-700 outline-none) transition-colors w-full h-full p-4"
                    value={text()}
                    onChange={handleChange}
                    onKeyPress={stopPropagation()}
                    autofocus
                    placeholder="URLs/IDs..."
                    rows={10}
                />

                <div class="flex justify-end">
                    <Button
                        class="flex items-center justify-center gap-2 px-4 py-1 bg-violet-500 hover:bg-violet-400 transition-colors text-light-50 font-montserrat rounded shadow"
                        title="Import"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default PlayerVideoImportModal;
