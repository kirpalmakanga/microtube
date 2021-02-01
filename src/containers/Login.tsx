import { FunctionComponent } from 'react';
import { signIn } from '../store/actions/user';

import Button from '../components/Button';
import Placeholder from '../components/Placeholder';

const Login: FunctionComponent = () => (
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

export default Login;
