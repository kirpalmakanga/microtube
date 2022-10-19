import { Component, createMemo } from 'solid-js';
import { formatTime } from '../../lib/helpers';
import Icon from '../Icon';

interface Props extends VideoData {
    index?: number;
    icon: string;
    isActive: boolean;
    onClick: () => void;
    onContextMenu: () => void;
}

const QueueItem: Component<Props> = (props) => {
    const duration = createMemo(() => formatTime(props.duration));

    // .QueueItem {
    //     @include transition(background-color, 0.2s, ease-out);
    //     height: 50px;
    //     -webkit-tap-highlight-color: transparent;
    //     position: relative;
    //     background-color: lighten($brand-primary, 20%);
    //     flex: 1;
    //     overflow: hidden;

    //     @media screen and (min-width: 480px) {
    //         &:hover {
    //             background-color: lighten($brand-primary, 30%);
    //         }
    //     }

    //     &,
    //     &__Content {
    //         display: flex;
    //         align-items: center;
    //     }

    //     &__Content {
    //         flex: 1;
    //         overflow: hidden;
    //     }

    //     &__Title,
    //     &__Duration {
    //         text-transform: uppercase;
    //         font-size: 12px;
    //         font-family: $font-primary;
    //         padding: 16px;

    //         &::selection {
    //             background-color: transparent;
    //         }

    //         @media screen and (min-width: 480px) {
    //             font-size: 16px;
    //         }
    //     }

    //     &__Title {
    //         text-overflow: ellipsis;
    //         overflow: hidden;
    //         white-space: nowrap;
    //         flex: 1;
    //         font-weight: 500;
    //     }

    //     &__Button {
    //         padding: 0;
    //         background-color: transparent;
    //         fill: $brand-secondary;
    //         display: flex;
    //         align-items: center;
    //         justify-content: center;
    //         border: none;
    //         height: 48px;
    //         width: 40px;
    //         cursor: pointer;
    //         font-weight: bold;
    //         font-size: 1rem;

    //         svg {
    //             height: 22px;
    //             width: 22px;
    //             @media screen and (min-width: 480px) {
    //                 height: 24px;
    //                 width: 24px;
    //             }
    //         }
    //     }

    //     &.is-active {
    //         &,
    //         &:hover {
    //             background-color: lighten($brand-primary, 40%);
    //         }
    //     }
    // }

    return (
        <div class="QueueItem" classList={{ 'is-active': props.isActive }}>
            <div
                class="QueueItem__Content"
                onClick={props.onClick}
                onContextMenu={props.onContextMenu}
            >
                <div class="QueueItem__Title">{props.title}</div>

                <div class="QueueItem__Duration">{duration()}</div>
            </div>

            <button
                class="QueueItem__Button icon-button"
                onClick={props.onContextMenu}
            >
                <Icon name="more" />
            </button>
        </div>
    );
};

export default QueueItem;
