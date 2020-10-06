import { connect } from './Channel/react-redux';

import { signIn } from '../actions/auth';

import Button from '../components/Button';
import Placeholder from '../components/Placeholder';

const Login = ({ signIn }) => {
    return (
        <Placeholder
            icon="lock"
            text="You must be logged in to access this content."
        >
            <Button
                className="button shadow--2dp"
                title="Log in"
                onClick={signIn}
            />
        </Placeholder>
    );
};

const mapDispatchToProps = {
    signIn
};

export default connect(() => ({}), mapDispatchToProps)(Login);
