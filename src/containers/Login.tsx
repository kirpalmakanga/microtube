import { Component } from 'solid-js';
import Button from '../components/Button';
import Placeholder from '../components/Placeholder';
import { useAuth } from '../store/user';

const Login: Component = () => {
    const [, { signIn }] = useAuth();

    return (
        <Placeholder
            icon="lock"
            text="You must be logged in to access this content."
        >
            <Button
                class="button shadow--2dp"
                icon="user"
                title="Log in"
                type="button"
                onClick={signIn}
            />
        </Placeholder>
    );
};

export default Login;
