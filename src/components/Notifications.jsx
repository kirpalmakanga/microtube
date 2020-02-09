import { Component } from 'react';
import { connect } from 'react-redux';

import { closeNotification } from '../actions/app.js';

import TranslateY from './animations/TranslateY';

class Notifications extends Component {
    render() {
        const {
            notifications: { message, isActive },
            closeNotification
        } = this.props;

        return (
            <TranslateY in={isActive} className="notification shadow--2dp">
                <div className="notification__content">
                    <div className="notification__text">{message || ''}</div>
                    <button
                        className="notification__action icon-button"
                        onClick={closeNotification}
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

const mapDispatchToProps = {
    closeNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
