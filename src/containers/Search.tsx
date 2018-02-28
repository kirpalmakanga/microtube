import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { searchVideos } from 'actions/youtube'

import Grid from 'components/Grid'

import VideoCard from 'components/cards/VideoCard'

interface Props {
    query: String
    items: Array<Object>
    nextPageToken: String
    initSearch: Function
    searchVideos: Function
    clearSearch: Function
}

interface State {
    query: String
    items: Array<Object>
    nextPageToken: String
}

interface StateFromProps {
    items: Array<Object>
    nextPageToken: String
}

interface DispatchFromProps {
    initSearch: Function
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

    componentWillReceiveProps({ query }: Props) {
        if (query !== this.props.query) {
            this.loadContent(query)
        }
    }

    componentWillMount() {
        this.loadContent(this.props.query)
    }

    loadContent = (newQuery) => {
        const { query, nextPageToken, searchVideos } = this.props

        if (query && nextPageToken !== null) {
            searchVideos({
                query: newQuery || query,
                pageToken: newQuery ? '' : nextPageToken
            })
        }
    }

    render({ items }: Props) {
        return items.length ? (
            <Grid
                items={items}
                loadContent={this.loadContent}
                ItemComponent={VideoCard}
            />
        ) : null
    }
}

const mapStateToProps = ({ search: { items, nextPageToken } }) => ({
    items,
    nextPageToken
})

const mapDispatchToProps = (dispatch) => ({
    initSearch: (query) => dispatch({ type: 'SEARCH_VIDEOS', data: { query } }),
    searchVideos: (params) => dispatch(searchVideos(params)),
    clearSearch: () => dispatch({ type: 'CLEAR_SEARCH' })
})

export default connect<StateFromProps, DispatchFromProps, void>(
    mapStateToProps,
    mapDispatchToProps
)(Search)
