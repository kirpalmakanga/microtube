import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { getFeed } from 'actions/youtube'

import Grid from 'components/Grid'

import VideoCard from 'components/cards/VideoCard'

interface Props {
    items: Array<Object>
    getFeed: Function
    clearFeed: Function
}

interface State {
    items: Array<Object>
}

interface StateFromProps {
    items: Array<Object>
}

interface DispatchFromProps {
    getFeed: Function
    clearFeed: Function
}

class Feed extends Component<Props, any> {
    constructor(props: Props) {
        super(props)
    }

    componentWillUnmount() {
        this.props.clearFeed()
    }

    render({ items, getFeed }: Props) {
        return (
            <Grid
                items={items}
                loadContent={getFeed}
                ItemComponent={VideoCard}
            />
        )
    }
}

const mapStateToProps = ({ feed: { items } }) => ({ items })

const mapDispatchToProps = (dispatch) => ({
    getFeed: () => dispatch(getFeed()),
    clearFeed: () => dispatch({ type: 'CLEAR_FEED' })
})

export default connect<StateFromProps, DispatchFromProps, void>(
    mapStateToProps,
    mapDispatchToProps
)(Feed)
