import { FunctionComponent } from 'react';

const formatPercent = (progress: number) => (progress * 100 - 100).toFixed(2);

interface Props {
    percentElapsed: number;
    percentLoaded: number;
}

const Progress: FunctionComponent<Props> = ({
    percentElapsed,
    percentLoaded
}) => {
    return (
        <div className="PlayerInfoProgress">
            <div className="PlayerInfoProgress__Gutter">
                {percentLoaded ? (
                    <div
                        className="PlayerInfoProgress__Gutter__Loaded"
                        style={{
                            transform: `translateX(${formatPercent(
                                percentLoaded
                            )}%)`
                        }}
                    />
                ) : null}

                {percentElapsed ? (
                    <div
                        className="PlayerInfoProgress__Gutter__Played"
                        style={{
                            opacity: percentElapsed ? 1 : 0,
                            transform: `translateX(${formatPercent(
                                percentElapsed
                            )}%)`
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
};
export default Progress;
