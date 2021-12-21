import { useParams } from 'solid-app-router';
import { Component, createMemo, For, Show } from 'solid-js';
import { wrapURLs } from '../../lib/helpers';
import { useChannel } from '../../store/hooks/channel';

const ChannelAbout: Component = () => {
    const { channelId } = useParams();
    const [channel] = useChannel(channelId);

    const text = createMemo(
        (text) => (text ? wrapURLs(text) : ''),
        channel.description
    );

    return <div className="channel__description" innerHTML={text()}></div>;
};

export default ChannelAbout;
