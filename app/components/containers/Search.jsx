import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { searchVideos } from '../../api/youtube'

import Grid from '../Grid'

import VideoCard from '../cards/VideoCard'

const Search = ({ search }) => {
  return (
    <div className={['search', search.isOpen ? 'search--show': '', 'shadow--2dp'].join(' ')}>
      {search.query ? (
        <Grid
          loadContent={(pageToken) => searchVideos({
            pageToken,
            query: search.query
          })}
          GridItem={VideoCard}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = ({ search }) => ({ search })

export default connect(mapStateToProps)(Search)
