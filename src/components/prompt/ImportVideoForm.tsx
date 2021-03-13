import {
    useState,
    useEffect,
    useRef,
    FunctionComponent,
    FormEvent
} from 'react';

interface Props {
    onSubmit: (text: string) => void;
}

export const ImportVideoForm: FunctionComponent<Props> = ({ onSubmit }) => {
    const [text, setState] = useState('');
    const input = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = ({
        currentTarget: { value }
    }: FormEvent<HTMLTextAreaElement>) => setState(value);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        onSubmit(text);
    };

    useEffect(() => {
        const keyPressHandler = (e: KeyboardEvent) => e.stopPropagation();

        input.current?.focus();

        input.current?.addEventListener('keypress', keyPressHandler);
        return () => {
            input.current?.removeEventListener('keypress', keyPressHandler);
        };
    }, [input]);

    return (
        <form id="importVideos" onSubmit={handleSubmit}>
            <div className="textfield">
                <textarea
                    id="videoId"
                    className="textfield__textarea"
                    value={text}
                    onChange={handleChange}
                    autoFocus
                    placeholder="URLs/IDs..."
                    rows={10}
                />
            </div>
        </form>
    );
};
