import { useNavigate, useSearchParams } from 'solid-app-router';
import { Component, onMount } from 'solid-js';
import axios from 'axios';
import Loader from '../components/Loader';
import { logIn } from '../api/youtube';
import { useAuth } from '../store/user';

const Callback: Component = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [_, { setUser }] = useAuth();

    onMount(async () => {
        const data = await logIn(searchParams.code);

        setUser(data);

        navigate('/');
    });

    return <Loader />;
};

export default Callback;
