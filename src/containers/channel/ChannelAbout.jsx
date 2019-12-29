import { Component } from 'react';
import { connect } from 'react-redux';

class ChannelAbout extends Component {
    render() {
        const {
            props: { description }
        } = this;

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
    }
}

const mapStateToProps = ({ channel: { description } }) => ({ description });

export default connect(mapStateToProps)(ChannelAbout);
