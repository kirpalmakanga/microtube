import { Component, Show } from 'solid-js';

const formatPercent = (progress: number) => (progress * 100 - 100).toFixed(2);

interface Props {
    percentElapsed: number;
    percentLoaded: number;
}

const Progress: Component<Props> = (props) => {
    return (
        <div className="PlayerInfoProgress">
            <div className="PlayerInfoProgress__Gutter">
                <Show when={props.percentLoaded}>
                    <div
                        className="PlayerInfoProgress__Gutter__Loaded"
                        style={{
                            transform: `translateX(${formatPercent(
                                props.percentLoaded
                            )}%)`
                        }}
                    />
                </Show>

                <Show when={props.percentElapsed}>
                    <div
                        className="PlayerInfoProgress__Gutter__Played"
                        style={{
                            opacity: props.percentElapsed ? 1 : 0,
                            transform: `translateX(${formatPercent(
                                props.percentElapsed
                            )}%)`
                        }}
                    />
                </Show>
            </div>
        </div>
    );
};
export default Progress;
