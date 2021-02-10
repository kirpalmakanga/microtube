import { useParams } from 'react-router-dom';
import { useChannel } from '../../store/hooks/channel';

import { wrapURLs } from '../../lib/helpers';

const ChannelAbout = () => {
    const { channelId } = useParams();
    const [{ description }] = useChannel(channelId);

    return (
        <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            {description
                ? wrapURLs(description)
                      .split('\n')
                      .filter(Boolean)
                      .map((line: string, index: number) => (
                          <p
                              key={index}
                              dangerouslySetInnerHTML={{ __html: line }}
                          ></p>
                      ))
                : null}
        </div>
    );
};

export default ChannelAbout;
