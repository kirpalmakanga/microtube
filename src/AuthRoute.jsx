import { connect } from 'react-redux';

import { Route } from 'react-router-dom';

import Loader from './components/Loader';
import Login from './containers/Login';

const AuthRoute = ({ isSignedIn, isSigningIn, element, ...props }) => (
    <Route
        {...props}
        element={
            isSignedIn ? element : isSigningIn ? <Loader isActive /> : <Login />
        }
    />
);

const mapStateToProps = ({ auth: { isSignedIn, isSigningIn } }) => ({
    isSignedIn,
    isSigningIn
});

export default connect(mapStateToProps)(AuthRoute);
