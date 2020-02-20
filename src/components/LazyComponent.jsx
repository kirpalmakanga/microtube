import { Suspense, lazy } from 'react';

import Loader from './Loader';

const LazyComponent = (Component) => (props) => {
    const C = lazy(Component);

    return (
        <Suspense fallback={<Loader isActive />}>
            <C {...props} />
        </Suspense>
    );
};

export default LazyComponent;
