import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { searchVideos } from 'actions/youtube'

import Grid from 'components/Grid'

import VideoCard from 'components/cards/VideoCard'

interface Props {
    query: String
    currentQuery: String
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
    currentQuery: String
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

    componentWillReceiveProps({ query, currentQuery, initSearch }: Props) {
        if (currentQuery !== query) {
            this.loadContent()
        }
    }

    componentWillMount() {
        const { query, initSearch } = this.props
        query && initSearch(query)
    }

    loadContent = () => {
        const { query, nextPageToken, searchVideos } = this.props

        nextPageToken !== null &&
            searchVideos({
                query,
                pageToken: nextPageToken
            })
    }

    render({ query, currentQuery, items, nextPageToken, searchVideos }: Props) {
        return (
            <Grid
                items={items}
                loadContent={this.loadContent}
                ItemComponent={VideoCard}
            />
        )
    }
}

const mapStateToProps = ({
    search: { query: currentQuery, items, nextPageToken }
}) => ({
    currentQuery,
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
