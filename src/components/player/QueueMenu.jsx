import Icon from '../Icon';

const noop = () => {};

const QueueMenu = ({
    onClickOverlay = noop,
    onClickAdd = noop,
    onClickRemove = noop
}) => (
    <div class="queue__menu" onClick={onClickOverlay}>
        <ul class="shadow--2dp">
            <li>
                <button
                    type="button"
                    class="queue__menu-item"
                    onClick={onClickAdd}
                >
                    <Icon name="playlist-add" />

                    <span>Add to playlist</span>
                </button>
            </li>

            <li>
                <button
                    type="button"
                    class="queue__menu-item"
                    onClick={onClickRemove}
                >
                    <Icon name="close" />

                    <span>Remove from queue</span>
                </button>
            </li>
        </ul>
    </div>
);

export default QueueMenu;
