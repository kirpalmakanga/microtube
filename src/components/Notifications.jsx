import { useDispatch, useSelector } from 'react-redux';

import { closeNotification } from '../store/actions/app.js';

import TranslateY from './animations/TranslateY';

const Notifications = () => {
    const { message, isActive } = useSelector(
        ({ notifications }) => notifications
    );

    const dispatch = useDispatch();

    const handleCloseNotification = () => dispatch(closeNotification());

    return (
        <TranslateY in={isActive} className="notification shadow--2dp">
            <div className="notification__content">
                <div className="notification__text">{message || ''}</div>
                <button
                    className="notification__action icon-button"
                    onClick={handleCloseNotification}
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
};

export default Notifications;
