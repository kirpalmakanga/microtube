import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { searchVideos } from 'actions/youtube'

import Grid from 'components/Grid'

import VideoCard from 'components/cards/VideoCard'

interface Props {
  items: Array<Object>
  nextPageToken: String
  searchVideos: Function
  clearSearch: Function
}

interface StateFromProps {
  items: Array<Object>
  nextPageToken: String
}

interface DispatchFromProps {
  searchVideos: Function
  clearSearch: Function
}

class Search extends Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  componentWillUnmount() {
    this.props.clearSearch()
  }

  render({ query, items, nextPageToken, searchVideos, clearSearch }) {
    return (
      <Grid
        items={items}
        loadContent={() =>
          query &&
          nextPageToken !== null &&
          searchVideos({
            query,
            pageToken: nextPageToken
          })
        }
        ItemComponent={VideoCard}
      />
    )
  }
}

const mapStateToProps = ({ search: { query, items, nextPageToken } }) => ({
  query,
  items,
  nextPageToken
})

const mapDispatchToProps = (dispatch) => ({
  searchVideos: (params) => dispatch(searchVideos(params)),
  clearSearch: () => dispatch({ type: 'CLEAR_SEARCH' })
})

export default connect<StateFromProps, DispatchFromProps, void>(
  mapStateToProps,
  mapDispatchToProps
)(Search)
