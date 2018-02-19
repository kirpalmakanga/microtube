import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'components/Waypoint'

import VisibilitySensor from 'components/VisibilitySensor'

interface Props {
    items: Array<Object>
    loadContent: Function
    ItemComponent: any
}

interface State {
    isLoading: Boolean
}

class Grid extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            isLoading: false
        }
    }

    private grid: Element

    loadItems = () => {
        const { loadContent } = this.props
        const { isLoading } = this.state

        if (isLoading) {
            return
        }

        this.setState({ isLoading: true }, async (): Promise<any> => {
            await loadContent()

            this.setState({ isLoading: false })
        })
    }

    componentDidMount() {
        this.forceUpdate()
    }

    render({ items = [], ItemComponent }: Props, { isLoading }: State) {
        return (
            <div
                class="grid"
                ref={(el) => {
                    this.grid = el
                }}
            >
                {this.grid &&
                    items.map((data, i) => (
                        <VisibilitySensor
                            key={i}
                            className={(isVisible) =>
                                ['grid__item', isVisible ? '' : 'hidden'].join(
                                    ' '
                                )
                            }
                            partialVisibility={true}
                            scrollCheck={true}
                            scrollThrottle={100}
                            containment={this.grid}
                            intervalCheck={true}
                        >
                            {({ isVisible }) =>
                                isVisible ? <ItemComponent {...data} /> : null
                            }
                        </VisibilitySensor>
                    ))}

                <div
                    class={['grid__loading', isLoading ? 'is-active' : ''].join(
                        ' '
                    )}
                >
                    {this.grid ? (
                        <Waypoint
                            container={this.grid}
                            onEnter={this.loadItems}
                        />
                    ) : null}
                    <svg class="rotating">
                        <use xlinkHref="#icon-loading" />
                    </svg>
                </div>
            </div>
        )
    }
}

export default Grid
