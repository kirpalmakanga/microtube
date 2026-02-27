import { Component, onMount } from 'solid-js';
import { useNavigate, useSearchParams } from '@solidjs/router';
import Loader from '../components/Loader';
import { logIn } from '../api/youtube';
import { useAuth } from '../store/user';
import { captureError } from '../lib/helpers';

const Callback: Component = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [_, { setUser }] = useAuth();

    onMount(async () => {
        const { code } = searchParams;

        if (code) {
            const data = await logIn(code as string);

            setUser(data);

            navigate('/');
        } else {
            captureError(new Error('Missing authorization code'));
        }
    });

    return <Loader />;
};

export default Callback;
