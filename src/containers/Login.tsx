import { Component, Show } from 'solid-js';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Placeholder from '../components/Placeholder';
import { useAuth } from '../store/hooks/auth';

const Login: Component = () => {
    const [{ isSigningIn }, { signIn }] = useAuth();

    return (
        <Show when={!isSigningIn} fallback={<Loader />}>
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
        </Show>
    );
};

export default Login;
