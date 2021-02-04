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
        <div className="player__info-progress">
            <div className="player__info-progress-gutter">
                {percentLoaded ? (
                    <div
                        className="player__info-progress-loaded"
                        style={{
                            transform: `translateX(${formatPercent(
                                percentLoaded
                            )}%)`
                        }}
                    />
                ) : null}

                {percentElapsed ? (
                    <div
                        className="player__info-progress-played"
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
