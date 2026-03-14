import { useStore } from '../../store';
import Button from '../ui/Button';

const Login = () => {
    const [
        {
            user: { isSignedIn }
        }
    ] = useStore();

    return (
        <div>
            <div>Avatar</div>
            <div>Name</div>

            <Button onClick={() => {}}>{isSignedIn ? 'Log out' : 'Log in'}</Button>
        </div>
    );
};

export default Login;
