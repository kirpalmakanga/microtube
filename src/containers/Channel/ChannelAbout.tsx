import { useParams } from 'solid-app-router';
import { Component, createMemo } from 'solid-js';
import { wrapURLs } from '../../lib/helpers';
import { useChannel } from '../../store/channel';

const ChannelAbout: Component = () => {
    const { channelId } = useParams();
    const [channel] = useChannel(channelId);

    const text = createMemo(
        (text: string) => (text ? wrapURLs(text) : ''),
        channel.description
    );

    return <div class="channel__description" innerHTML={text()}></div>;
};

export default ChannelAbout;
