import React, { Component } from 'react';
import { connect } from 'react-redux';
import TranslateY from './animations/TranslateY';

class Notifications extends Component {
    render() {
        const {
            notifications: { message, isActive },
            onClickClose
        } = this.props;
        return (
            <TranslateY in={isActive} className="notification">
                <div className="notification__content">
                    <div className="notification__text">{message || ''}</div>
                    <button
                        className="notification__action icon-button"
                        onClick={onClickClose}
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

export default connect(mapStateToProps)(Notifications);
