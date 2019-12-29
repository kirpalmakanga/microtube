import { Component } from 'react';
import { connect } from 'react-redux';
import TranslateY from './animations/TranslateY';
import { delay } from '../lib/helpers';

class Notifications extends Component {
    render() {
        const {
            notifications: { message, isActive },
            close
        } = this.props;

        return (
            <TranslateY in={isActive} className="notification shadow--2dp">
                <div className="notification__content">
                    <div className="notification__text">{message || ''}</div>
                    <button
                        className="notification__action icon-button"
                        onClick={close}
                    >
                        <span className="icon">
                            <svg>
                                <use xlinkHref="#icon-close" />
                            </svg>
                        </span>
                    </button>
                </div>
            </TranslateY>
        );
    }
}

const mapStateToProps = ({ notifications }) => ({ notifications });

const mapDispatchToProps = (dispatch) => ({
    close: async () => {
        dispatch({ type: 'notifications/CLOSE' });

        await delay(300);

        dispatch({ type: 'notifications/CLEAR_MESSAGE' });
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notifications);
