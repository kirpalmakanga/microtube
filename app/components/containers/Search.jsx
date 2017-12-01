import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import api from '../../api/youtube'

import Grid from '../Grid'

import VideoCard from '../cards/VideoCard'

const Search = ({ auth, search }) => {
  return (
    <div className={['search', search.isOpen ? 'search--show': '', 'shadow--2dp'].join(' ')}>
      {search.query ? (
        <Grid
          loadContent={(pageToken) => api.searchVideos({
            accessToken: auth.token,
            pageToken,
            query: search.query
          })}
          GridItem={VideoCard}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = ({ auth, search }) => ({ auth, search })

export default connect(mapStateToProps)(Search)
