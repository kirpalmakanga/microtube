import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getPlaylists } from '../actions/youtube';

import Grid from '../components/Grid';

import PlaylistCard from '../components/cards/PlaylistCard';

/* TODO: Créer un composant "Screen" */

class Playlists extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.forceUpdate();
    }

    render() {
        const { items, nextPageToken, getPlaylists } = this.props;

        return (
            <Grid
                items={items}
                loadContent={() =>
                    nextPageToken !== null &&
                    getPlaylists({
                        mine: true,
                        pageToken: nextPageToken
                    })
                }
                ItemComponent={PlaylistCard}
            />
        );
    }
}

const mapStateToProps = ({ playlists: { items, nextPageToken } }) => ({
    items,
    nextPageToken
});

const mapDispatchToProps = (dispatch) => ({
    getPlaylists: (params) => dispatch(getPlaylists(params))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlists);
