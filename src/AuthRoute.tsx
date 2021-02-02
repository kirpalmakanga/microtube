import { FunctionComponent, ReactElement } from 'react';
import { Route } from 'react-router-dom';
import { useStore } from './store';

import Loader from './components/Loader';
import Login from './containers/Login';

interface Props {
    element: ReactElement;
}

const AuthRoute: FunctionComponent<Props> = ({ element, ...props }) => {
    const [
        {
            user: { isSignedIn, isSigningIn }
        }
    ] = useStore();

    return (
        <Route
            {...props}
            element={
                isSignedIn ? (
                    element
                ) : isSigningIn ? (
                    <Loader isActive />
                ) : (
                    <Login />
                )
            }
        />
    );
};

export default AuthRoute;
