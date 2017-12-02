import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getSubscriptions } from '../../api/youtube'

import Grid from '../Grid'

import SubscriptionCard from '../cards/SubscriptionCard'

const Subscriptions = () => {
  return (
    <Grid
      loadContent={(pageToken) => getSubscriptions({
        mine: true,
        pageToken
      })}
      GridItem={SubscriptionCard}
    />
  )
}

export default Subscriptions
