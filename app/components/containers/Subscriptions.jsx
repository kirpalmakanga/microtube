import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import api from '../../api/youtube'

import Grid from '../Grid'

import SubscriptionCard from '../cards/SubscriptionCard'

const Subscriptions = ({ auth, subscriptions }) => {
  return (
    <Grid
      loadContent={(pageToken) => api.getSubscriptions({
        accessToken: auth.token,
        pageToken
      })}
      GridItem={SubscriptionCard}
    />
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(Subscriptions)
