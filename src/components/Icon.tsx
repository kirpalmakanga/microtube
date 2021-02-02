import { FunctionComponent } from 'react';

interface Props {
    name: string
    className?: string
}

const Icon: FunctionComponent<Props> = ({ name, className = ''}) =>
    name ? (
        <span className={['icon', className].join(' ')}>
            <svg>
                <use xlinkHref={`#icon-${name}`} />
            </svg>
        </span>
    ) : null;

export default Icon;
