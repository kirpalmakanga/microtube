import { Suspense, lazy, FunctionComponent } from 'react';

import Loader from './Loader';

interface ComponentImport {
    default: FunctionComponent;
}

type Cmp = () => Promise<ComponentImport>;

const AsyncComponent = (Component: Cmp): FunctionComponent => (props) => {
    const C = lazy(Component);

    return (
        <Suspense fallback={<Loader isActive />}>
            <C {...props} />
        </Suspense>
    );
};

export default AsyncComponent;
