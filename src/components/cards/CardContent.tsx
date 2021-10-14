import { JSXElement, Component, splitProps } from 'solid-js';

interface Props {
    children: JSXElement;
    onClick: () => void;
}

const CardContent: Component<Props> = (props) => {
    const [localProps, containerProps] = splitProps(props, ['children']);

    return (
        <div className="card__content" {...containerProps}>
            {localProps.children}
        </div>
    );
};

export default CardContent;
