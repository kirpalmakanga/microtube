import { FunctionComponent } from 'react';

import Button from '../components/Button';
import Placeholder from '../components/Placeholder';

import { useAuth } from '../store/hooks/auth';

const Login: FunctionComponent = () => {
    const [, { signIn }] = useAuth();

    return (
        <Placeholder
            icon="lock"
            text="You must be logged in to access this content."
        >
            <Button
                className="button shadow--2dp"
                icon="user"
                title="Log in"
                type="button"
                onClick={signIn}
            />
        </Placeholder>
    );
};
export default Login;
