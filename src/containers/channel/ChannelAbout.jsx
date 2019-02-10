import React, { Component } from 'react';
import { connect } from 'react-redux';

class ChannelAbout extends Component {
    render() {
        return <p style={{ marginLeft: '20px' }}>Coming soon.</p>;
    }
}

export default connect()(ChannelAbout);
