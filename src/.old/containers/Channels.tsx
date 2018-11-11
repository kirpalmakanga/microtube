import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getSubscriptions } from 'actions/youtube'

import Grid from 'components/Grid'

import ChannelCard from 'components/cards/ChannelCard'

interface Props {
  playlistId: String
  items: Array<Object>
  nextPageToken: String
  getSubscriptions: Function
}

interface StateFromProps {
  items: Array<Object>
  nextPageToken: String
}

interface DispatchFromProps {
  getSubscriptions: Function
}

const Subscriptions = ({ items, nextPageToken, getSubscriptions }: Props) => {
  return (
    <Grid
      items={items}
      loadContent={() =>
        nextPageToken !== null &&
        getSubscriptions({
          mine: true,
          pageToken: nextPageToken
        })
      }
      ItemComponent={ChannelCard}
    />
  )
}

const mapStateToProps = ({ subscriptions: { items, nextPageToken } }) => ({
  items,
  nextPageToken
})

const mapDispatchToProps = (dispatch) => ({
  getSubscriptions: (params) => dispatch(getSubscriptions(params))
})

export default connect<StateFromProps, DispatchFromProps, void>(
  mapStateToProps,
  mapDispatchToProps
)(Subscriptions)
