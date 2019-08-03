import React, { Suspense } from 'react';

import Loader from './Loader';

const WaitingComponent = (Component) => (props) => (
    <Suspense fallback={<Loader isActive />}>
        <Component {...props} />
    </Suspense>
);

export default WaitingComponent;
