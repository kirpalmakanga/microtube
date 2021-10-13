import { Component, splitProps } from 'solid-js';

interface Props {
    onClick?: () => void;
    onContextMenu?: () => void;
}

const CardContainer: Component<Props> = (props) => {
    const [localProps, containerProps] = splitProps(props, ['children']);

    return (
        <div className="card" {...containerProps}>
            {localProps.children}
        </div>
    );
};

export default CardContainer;
