import { Component, createSignal } from 'solid-js';
import { HTMLElementEvent } from '../../../@types/alltypes';
import { preventDefault, stopPropagation } from '../../lib/helpers';

interface Props {
    onSubmit: (text: string) => void;
}

export const ImportVideoForm: Component<Props> = ({ onSubmit }) => {
    const [text, setState] = createSignal('');
    let input;

    const handleChange = ({
        currentTarget: { value }
    }: HTMLElementEvent<HTMLTextAreaElement>) => setState(value);

    const handleSubmit = preventDefault(() => onSubmit(text()));

    const handleKeyPress = stopPropagation();

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
