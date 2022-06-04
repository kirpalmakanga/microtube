import { Component } from 'solid-js';
import { formatTime } from '../../../lib/helpers';

interface Props {
    time: number;
    duration: number;
}

const Time: Component<Props> = (props) => (
    <div class="PlayerInfoTime">
        <span>{props.duration ? formatTime(props.time || 0) : '--'}</span>
        <span class="PlayerInfoTime__Separator">/</span>
        <span>{props.duration ? formatTime(props.duration || 0) : '--'}</span>
    </div>
);

export default Time;
