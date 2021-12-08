import { Component, createSignal, JSX, onCleanup, onMount } from 'solid-js';
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

    // let clipboardWatcher: number;

    // onMount(() => {
    // clipboardWatcher = setImmediateInterval(async () => {
    //     const text = navigator.clipboard.readText();
    //     console.log({ text });
    // }, 200);
    // });

    // onCleanup(() => clearInterval(clipboardWatcher));

    return (
        <form id="importVideos" onSubmit={handleSubmit}>
            <div className="textfield">
                <textarea
                    id="videoId"
                    className="textfield__textarea"
                    value={text()}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    autofocus
                    placeholder="URLs/IDs..."
                    rows={10}
                />
            </div>
        </form>
    );
};
