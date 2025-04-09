import { Component, createSignal } from 'solid-js';
import Button from '../components/Button';
import Placeholder from '../components/Placeholder';
import { delay } from '../lib/helpers';
import { useNotifications } from '../store/notifications';
import { useAuth } from '../store/user';

const Login: Component = () => {
    const [isSigningIn, setIsSigningIn] = createSignal(false);
    const [, { signIn }] = useAuth();
    const [, { openNotification }] = useNotifications();

    const handleSignIn = async () => {
        if (isSigningIn()) return;

        setIsSigningIn(true);

        try {
            await signIn();

            setIsSigningIn(false);
        } catch (error) {
            await delay(50);

            setIsSigningIn(false);

            openNotification('Signing in failed, please try again.');
        }
    };

    return (
        <Placeholder
            icon="lock"
            text="You must be logged in to access this content."
        >
            <Button
                class="flex items-center justify-center gap-2 px-4 py-1 bg-primary-900 hover:bg-primary-800 transition-colors font-montserrat text-light-50 rounded shadow"
                icon="user"
                title="Log in"
                type="button"
                isLoading={isSigningIn()}
                onClick={handleSignIn}
            />
        </Placeholder>
    );
};

export default Login;
