import { Component, Show } from 'solid-js';

const formatPercent = (progress: number) => (progress * 100 - 100).toFixed(2);

interface Props {
    percentElapsed: number;
    percentLoaded: number;
}

const Progress: Component<Props> = (props) => {
    return (
        <div class="flex flex-grow absolute inset-0 opacity-50">
            <div class="relative flex flex-grow overflow-hidden">
                <Show when={props.percentLoaded}>
                    <div
                        class="absolute inset-0 transition-transform -translate-y-full bg-primary-700"
                        style={{
                            transform: `translateX(${formatPercent(
                                props.percentLoaded
                            )}%)`
                        }}
                    />
                </Show>

                <Show when={props.percentElapsed}>
                    <div
                        class="absolute inset-0 transition-transform -translate-y-full bg-primary-500"
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
