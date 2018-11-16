import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getPlaylistItems } from '../actions/youtube';

import Screen from '../layout/Screen';

import Grid from '../components/Grid';

import VideoCard from '../components/cards/VideoCard';

class Playlist extends Component {
  componentWillUnmount() {
    this.props.clearPlaylistItems();
  }

  render() {
    const {
      playlistId,
      items,
      nextPageToken,
      getPlaylistItems,
      setAsActiveItem,
      pushToQueue
    } = this.props;

    return (
      <Screen>
        <Grid
          items={items}
          loadContent={() =>
            nextPageToken !== null &&
            getPlaylistItems({
              playlistId,
              pageToken: nextPageToken
            })
          }
          renderItem={(data) => {
            return (
              <VideoCard
                {...data}
                onClick={() => setAsActiveItem(data)}
                pushToQueue={() => pushToQueue(data)}
              />
            );
          }}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (
  { playlistItems: { items, nextPageToken } },
  {
    match: {
      params: { playlistId }
    }
  }
) => ({
  playlistId,
  items,
  nextPageToken
});

const mapDispatchToProps = (dispatch) => ({
  getPlaylistItems: (params) => dispatch(getPlaylistItems(params)),
  clearPlaylistItems: () => dispatch({ type: 'CLEAR_PLAYLIST_ITEMS' }),
  setAsActiveItem: (video) =>
    dispatch({
      type: 'QUEUE_SET_ACTIVE_ITEM',
      data: { video }
    }),

  pushToQueue: (data) => dispatch({ type: 'QUEUE_PUSH', data })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playlist);
