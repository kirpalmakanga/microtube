import { FunctionComponent } from 'react';

import Button from '../components/Button';
import Placeholder from '../components/Placeholder';

import { useAuth } from '../store/hooks/auth';

const Login: FunctionComponent = () => {
    const [_, { signIn }] = useAuth();

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
export default Login;
