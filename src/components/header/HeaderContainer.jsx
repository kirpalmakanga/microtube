import { h, render, Component } from 'preact'
import { connect } from 'preact-redux'
import { Link } from 'preact-router/match'

import {
    signIn,
    signOut,
    getPlaylistTitle,
    getChannelTitle,
    getChannelId
} from '../../api/youtube'

import QueueHeader from './QueueHeader'
import SearchHeader from './SearchHeader'
import SearchForm from '../SearchForm'

const initialState = {
    title: 'MicroTube'
}

class Header extends Component {
    constructor(props) {
        super(props)

        this.state = initialState
    }

    componentWillReceiveProps = async ({ auth, path }) => {
        let title = 'MicroTube'

        if (path.includes('/subscriptions')) {
            title = 'Subscriptions'
        }

        if (path.includes('/channel')) {
            title = await getChannelTitle(path.slice(1).split('/')[1])
        }

        if (path.includes('/playlist')) {
            title = await getPlaylistTitle(path.slice(1).split('/')[1])
        }

        this.setState({ title })
    }

    openSearchForm = () => {
        const { dispatch } = this.props

        dispatch({ type: 'SCREEN_CLOSE' })

        dispatch({ type: 'QUEUE_CLOSE' })

        dispatch({ type: 'SEARCH_OPEN' })
    }

    handleAuth = async () => {
        const { auth: { isSignedIn }, dispatch } = this.props

        if (!isSignedIn) {
            const data = await signIn()

            return dispatch({ type: 'SIGN_IN', data })
        }

        await signOut()

        dispatch({ type: 'SIGN_OUT' })
    }

    render(
        { auth: { isSignedIn, user: { picture } }, player, path, dispatch },
        { title }
    ) {
        return (
            <header class="layout__header shadow--2dp">
                {player.showQueue ? (
                    <QueueHeader />
                ) : path.includes('/search') ? (
                    <SearchHeader />
                ) : (
                    <div class="layout__header-row">
                        {path !== '/' ? (
                            <Link
                                class="layout__back-button icon-button"
                                href="/"
                                aria-label="Go to homepage"
                            >
                                <span class="icon">
                                    <svg>
                                        <use xlinkHref="#icon-back" />
                                    </svg>
                                </span>
                            </Link>
                        ) : null}

                        <span class="layout-title">{title}</span>

                        <nav class="navigation">
                            <Link
                                class="navigation__link icon-button"
                                aria-label="Open search"
                                href="/search"
                            >
                                <span class="icon">
                                    <svg>
                                        <use xlinkHref="#icon-search" />
                                    </svg>
                                </span>
                            </Link>

                            <Link
                                class="navigation__link icon-button"
                                href="/subscriptions"
                                aria-label="Open subscriptions"
                            >
                                <span class="icon">
                                    <svg>
                                        <use xlinkHref="#icon-subscriptions" />
                                    </svg>
                                </span>
                            </Link>

                            <button
                                class="navigation__link icon-button"
                                onClick={this.handleAuth}
                                aria-label={isSignedIn ? 'Log out' : 'Log in'}
                            >
                                {picture ? (
                                    <img src={picture} alt="avatar" />
                                ) : (
                                    <span class="icon">
                                        <svg>
                                            <use xlinkHref="#icon-account" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>
                )}
            </header>
        )
    }
}

const mapStateToProps = ({ auth, player }) => ({ auth, player })

export default connect(mapStateToProps)(Header)
