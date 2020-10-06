import Icon from '../Icon';

export default ({ text }) => (
    <header className="dialog__header">
        <Icon name="prompt" />
        {text}
    </header>
);
