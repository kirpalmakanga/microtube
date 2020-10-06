import { useSelector } from './react-redux';

const ChannelAbout = () => {
    const description = useSelector(
        ({ channel: { description } }) => description
    );

    return (
        <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            {description
                ? description
                      .split('\n')
                      .filter(Boolean)
                      .map((line, index) => <p key={index}>{line}</p>)
                : null}
        </div>
    );
};

export default ChannelAbout;
