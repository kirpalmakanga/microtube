import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getSubscriptions } from '../../actions/youtube'

import Grid from '../Grid'

import ChannelCard from '../cards/ChannelCard'

const Subscriptions = ({ subscriptions, dispatch }) => {
  const { items, nextPageToken } = subscriptions

  return (
    <Grid
      items={items}
      loadContent={() => nextPageToken !== null && dispatch(
        getSubscriptions({
          mine: true,
          pageToken: nextPageToken
        })
      )}
      ItemComponent={ChannelCard}
    />
  )
}

const mapStateToProps = ({ subscriptions }) => ({ subscriptions })

export default connect(mapStateToProps)(Subscriptions)
