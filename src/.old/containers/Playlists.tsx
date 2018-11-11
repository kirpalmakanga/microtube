import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getPlaylists } from 'actions/youtube'

import Grid from 'components/Grid'

import PlaylistCard from 'components/cards/PlaylistCard'

interface Props {
    items: Array<Object>
    nextPageToken: String
    getPlaylists: Function
}

interface StateFromProps {
    items: Array<Object>
    nextPageToken: String
}

interface DispatchFromProps {
    getPlaylists: Function
}

class Playlists extends Component<Props, any> {
    constructor(props: Props) {
        super(props)
    }

    componentDidMount() {
        this.forceUpdate()
    }

    render({ items, nextPageToken, getPlaylists }: Props) {
        return (
            <Grid
                items={items}
                loadContent={() =>
                    nextPageToken !== null &&
                    getPlaylists({
                        mine: true,
                        pageToken: nextPageToken
                    })
                }
                ItemComponent={PlaylistCard}
            />
        )
    }
}

const mapStateToProps = ({ playlists: { items, nextPageToken } }) => ({
    items,
    nextPageToken
})

const mapDispatchToProps = (dispatch) => ({
    getPlaylists: (params) => dispatch(getPlaylists(params))
})

export default connect<StateFromProps, DispatchFromProps, void>(
    mapStateToProps,
    mapDispatchToProps
)(Playlists)
