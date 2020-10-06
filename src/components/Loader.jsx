import Fade from './animations/Fade';
import Icon from './Icon';

const Loader = ({ isActive, style }) => {
    return (
        <Fade className="loader" in={isActive}>
            <div className="loader__background" style={style} />
            <Icon className="rotating" name="loading" />
        </Fade>
    );
};

export default Loader;
