import { Component, createMemo, For, Show } from 'solid-js';
import { useParams } from 'solid-app-router';
import { useChannel } from '../../store/hooks/channel';

import { wrapURLs } from '../../lib/helpers';

const ChannelAbout: Component = () => {
    const { channelId } = useParams();
    const [channel] = useChannel(channelId);
    const paragraphs = createMemo((text) => {
        if (text)
            return wrapURLs(text)
                .split('\n')
                .filter((text) => text && text.trim());
        else return [];
    }, channel.description);

    return (
        <div className="channel__description">
            <Show when={paragraphs().length}>
                <For each={paragraphs()}>
                    {(line: string) => <p innerHTML={line}></p>}
                </For>
            </Show>
        </div>
    );
};

export default ChannelAbout;
