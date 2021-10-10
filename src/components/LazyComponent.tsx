import { Suspense, lazy, FunctionComponent } from 'react';

import Loader from './Loader';
interface ComponentImport {
    default: FunctionComponent;
}

type Cmp = () => Promise<ComponentImport>;

const AsyncComponent =
    (Component: Cmp): FunctionComponent =>
    (props: any) => {
        const C = lazy(Component);

        return (
            <Suspense fallback={<Loader />}>
                <C {...props} />
            </Suspense>
        );
    };

export default AsyncComponent;
