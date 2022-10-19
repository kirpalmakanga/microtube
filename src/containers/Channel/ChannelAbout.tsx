import { Component, createMemo } from 'solid-js';
import { useParams } from '@solidjs/router';
import { wrapURLs } from '../../lib/helpers';
import { useChannel } from '../../store/channel';

const ChannelAbout: Component = () => {
    const { channelId } = useParams();
    const [channel] = useChannel(channelId);

    const text = createMemo(
        (text: string) => (text ? wrapURLs(text) : ''),
        channel.description
    );

    return (
        <div
            class="flex flex-col text-light-50 gap-2 p-4"
            innerHTML={text()}
        ></div>
    );
};

export default ChannelAbout;
