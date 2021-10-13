import { Component, splitProps } from 'solid-js';

interface Props {
    className: string;
}

const CardTitle: Component<Props> = (props) => {
    const [localProps, headerProps] = splitProps(props, [
        'className',
        'children'
    ]);

    return (
        <h3
            className={['card__subtitle', localProps.className].join(' ')}
            {...headerProps}
        >
            {localProps.children}
        </h3>
    );
};

export default CardTitle;
