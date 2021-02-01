import { FunctionComponent} from 'react';
import Fade from './animations/Fade';
import Icon from './Icon';

interface Props {
    isActive: boolean,
}

const Loader: FunctionComponent<Props> = ({ isActive }: Props) => {
    return (
        <Fade className="loader" in={isActive}>
            <div className="loader__background" />
            <Icon name="loading" />
        </Fade>
    );
};

export default Loader;
