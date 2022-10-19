import { Component, createSignal, JSX } from 'solid-js';
import { preventDefault, stopPropagation } from '../../lib/helpers';

interface Props {
    onSubmit: (text: string) => void;
}

export const ImportVideoForm: Component<Props> = ({ onSubmit }) => {
    const [text, setText] = createSignal('');

    const handleChange: JSX.EventHandler<HTMLTextAreaElement, Event> = ({
        currentTarget: { value }
    }) => setText(value);

    const handleSubmit = preventDefault(() => onSubmit(text()));

    const handleKeyPress = stopPropagation();

    return (
        <form id="importVideos" class="flex flex-grow" onSubmit={handleSubmit}>
            <textarea
                id="videoId"
                class="bg-primary-800 focus:(bg-primary-700 outline-none) transition-colors w-full h-full p-4"
                value={text()}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                autofocus
                placeholder="URLs/IDs..."
                rows={10}
            />
        </form>
    );
};
