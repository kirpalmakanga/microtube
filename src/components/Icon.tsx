import { Component } from 'solid-js';

interface Props {
    name: string;
    className?: string;
}

const Icon: Component<Props> = ({ name, className = '' }: Props) =>
    name ? (
        <span className={['icon', className].join(' ')}>
            <svg>
                <use href={`#icon-${name}`} />
            </svg>
        </span>
    ) : null;

export default Icon;
