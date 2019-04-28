import Icon from '../components/Icon';

export default ({ icon, text, children }) => (
    <div className="placeholder">
        <Icon name={icon} />
        <p>{text}</p>
        {children}
    </div>
);
