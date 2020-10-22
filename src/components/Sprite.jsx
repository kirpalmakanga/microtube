const style = { display: 'none' };

const Sprite = () => (
    <svg style={style}>
        <symbol id="icon-arrow-left" viewBox="0 0 24 24">
            <path d="M11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711L7.41421 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H7.41421L11.7071 17.2929C12.0976 17.6834 12.0976 18.3166 11.7071 18.7071C11.3166 19.0976 10.6834 19.0976 10.2929 18.7071L4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929L10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289Z"></path>
        </symbol>
        <symbol id="icon-menu" viewBox="0 0 24 24">
            <path d="M3 6h18v2.016h-18v-2.016zM3 12.984v-1.969h18v1.969h-18zM3 18v-2.016h18v2.016h-18z" />
        </symbol>
        <symbol id="icon-search" viewBox="0 0 24 24">
            <path d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z"></path>
        </symbol>
        <symbol id="icon-user" viewBox="0 0 24 24">
            <path d="M12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4ZM6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8ZM8 18C6.34315 18 5 19.3431 5 21C5 21.5523 4.55228 22 4 22C3.44772 22 3 21.5523 3 21C3 18.2386 5.23858 16 8 16H16C18.7614 16 21 18.2386 21 21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21C19 19.3431 17.6569 18 16 18H8Z"></path>
        </symbol>
        <symbol id="icon-users" viewBox="0 0 24 24">
            <path d="M10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12C12.2091 12 14 10.2091 14 8C14 5.79086 12.2091 4 10 4ZM4 8C4 4.68629 6.68629 2 10 2C13.3137 2 16 4.68629 16 8C16 11.3137 13.3137 14 10 14C6.68629 14 4 11.3137 4 8ZM16.8284 3.75736C17.219 3.36683 17.8521 3.36683 18.2426 3.75736C20.5858 6.1005 20.5858 9.8995 18.2426 12.2426C17.8521 12.6332 17.219 12.6332 16.8284 12.2426C16.4379 11.8521 16.4379 11.219 16.8284 10.8284C18.3905 9.26633 18.3905 6.73367 16.8284 5.17157C16.4379 4.78105 16.4379 4.14788 16.8284 3.75736ZM17.5299 16.7575C17.6638 16.2217 18.2067 15.8959 18.7425 16.0299C20.0705 16.3618 20.911 17.2109 21.3944 18.1778C21.8622 19.1133 22 20.1571 22 21C22 21.5523 21.5523 22 21 22C20.4477 22 20 21.5523 20 21C20 20.3429 19.8878 19.6367 19.6056 19.0722C19.339 18.5391 18.9295 18.1382 18.2575 17.9701C17.7217 17.8362 17.3959 17.2933 17.5299 16.7575ZM6.5 18C5.24054 18 4 19.2135 4 21C4 21.5523 3.55228 22 3 22C2.44772 22 2 21.5523 2 21C2 18.3682 3.89347 16 6.5 16H13.5C16.1065 16 18 18.3682 18 21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21C16 19.2135 14.7595 18 13.5 18H6.5Z"></path>
        </symbol>
        <symbol id="icon-close" viewBox="0 0 24 24">
            <path d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"></path>
        </symbol>
        <symbol id="icon-check" viewBox="0 0 24 24">
            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16.6644 8.75259C17.0771 9.11951 17.1143 9.75158 16.7474 10.1644L11.4141 16.1644C11.2243 16.3779 10.9523 16.5 10.6667 16.5C10.381 16.5 10.109 16.3779 9.91926 16.1644L7.25259 13.1644C6.88567 12.7516 6.92285 12.1195 7.33564 11.7526C7.74842 11.3857 8.38049 11.4229 8.74741 11.8356L10.6667 13.9948L15.2526 8.83564C15.6195 8.42285 16.2516 8.38567 16.6644 8.75259Z"></path>
        </symbol>
        <symbol id="icon-add" viewBox="0 0 24 24">
            <path d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"></path>
        </symbol>
        <symbol id="icon-circle-add" viewBox="0 0 24 24">
            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z"></path>
        </symbol>
        <symbol id="icon-list" viewBox="0 0 24 24">
            <path d="M4 7C4 6.44772 4.44772 6 5 6H6C6.55228 6 7 6.44772 7 7C7 7.55228 6.55228 8 6 8H5C4.44772 8 4 7.55228 4 7ZM9 7C9 6.44772 9.44772 6 10 6H19C19.5523 6 20 6.44772 20 7C20 7.55228 19.5523 8 19 8H10C9.44772 8 9 7.55228 9 7ZM4 12C4 11.4477 4.44772 11 5 11H6C6.55228 11 7 11.4477 7 12C7 12.5523 6.55228 13 6 13H5C4.44772 13 4 12.5523 4 12ZM9 12C9 11.4477 9.44772 11 10 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H10C9.44772 13 9 12.5523 9 12ZM4 17C4 16.4477 4.44772 16 5 16H6C6.55228 16 7 16.4477 7 17C7 17.5523 6.55228 18 6 18H5C4.44772 18 4 17.5523 4 17ZM9 17C9 16.4477 9.44772 16 10 16H19C19.5523 16 20 16.4477 20 17C20 17.5523 19.5523 18 19 18H10C9.44772 18 9 17.5523 9 17Z"></path>
        </symbol>
        <symbol id="icon-volume-off" viewBox="0 0 24 24">
            <path d="M13.4179 2.0915C13.7727 2.25469 14 2.60948 14 3.00001V21C14 21.3905 13.7727 21.7453 13.4179 21.9085C13.0631 22.0717 12.6457 22.0134 12.3492 21.7593L5.63008 16H3C2.44772 16 2 15.5523 2 15V9.00001C2 8.44773 2.44772 8.00001 3 8.00001H5.63008L12.3492 2.24076C12.6457 1.9866 13.0631 1.92832 13.4179 2.0915ZM12 5.17423L6.65079 9.75927C6.46955 9.91462 6.23871 10 6 10H4V14H6C6.23871 14 6.46955 14.0854 6.65079 14.2408L12 18.8258V5.17423ZM16.2929 9.29291C16.6834 8.90238 17.3166 8.90238 17.7071 9.29291L19 10.5858L20.2929 9.29291C20.6834 8.90238 21.3166 8.90238 21.7071 9.29291C22.0976 9.68343 22.0976 10.3166 21.7071 10.7071L20.4142 12L21.7071 13.2929C22.0976 13.6834 22.0976 14.3166 21.7071 14.7071C21.3166 15.0976 20.6834 15.0976 20.2929 14.7071L19 13.4142L17.7071 14.7071C17.3166 15.0976 16.6834 15.0976 16.2929 14.7071C15.9024 14.3166 15.9024 13.6834 16.2929 13.2929L17.5858 12L16.2929 10.7071C15.9024 10.3166 15.9024 9.68343 16.2929 9.29291Z"></path>
        </symbol>
        <symbol id="icon-volume-up" viewBox="0 0 24 24">
            <path d="M13.4179 2.0915C13.7727 2.25469 14 2.60948 14 3.00001V21C14 21.3905 13.7727 21.7453 13.4179 21.9085C13.0631 22.0717 12.6457 22.0134 12.3492 21.7593L5.63008 16H3C2.44772 16 2 15.5523 2 15V9.00001C2 8.44773 2.44772 8.00001 3 8.00001H5.63008L12.3492 2.24076C12.6457 1.9866 13.0631 1.92832 13.4179 2.0915ZM12 5.17423L6.65079 9.75927C6.46955 9.91462 6.23871 10 6 10H4V14H6C6.23871 14 6.46955 14.0854 6.65079 14.2408L12 18.8258V5.17423ZM17.2929 5.29291C17.6834 4.90238 18.3166 4.90238 18.7071 5.29291L18.7078 5.29362L18.7086 5.29438L18.7102 5.29605L18.7141 5.29996L18.724 5.31008C18.7315 5.31784 18.7409 5.32765 18.752 5.33951C18.7742 5.36322 18.8034 5.39513 18.8385 5.43526C18.9087 5.51549 19.0028 5.62871 19.1125 5.77501C19.3318 6.06748 19.6147 6.49329 19.8944 7.0528C20.4556 8.17509 21 9.82725 21 12C21 14.1728 20.4556 15.8249 19.8944 16.9472C19.6147 17.5067 19.3318 17.9326 19.1125 18.225C19.0028 18.3713 18.9087 18.4845 18.8385 18.5648C18.8034 18.6049 18.7742 18.6368 18.752 18.6605C18.7409 18.6724 18.7315 18.6822 18.724 18.69L18.7141 18.7001L18.7102 18.704L18.7086 18.7056L18.7078 18.7064L18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071C16.904 18.3183 16.9024 17.6889 17.2879 17.2979L17.2929 17.2926C17.3 17.2851 17.3138 17.2701 17.3334 17.2478C17.3725 17.203 17.4347 17.1287 17.5125 17.025C17.6682 16.8175 17.8853 16.4933 18.1056 16.0528C18.5444 15.1751 19 13.8272 19 12C19 10.1728 18.5444 8.82494 18.1056 7.94723C17.8853 7.50674 17.6682 7.18255 17.5125 6.97501C17.4347 6.87131 17.3725 6.79704 17.3334 6.75227C17.3138 6.72989 17.3 6.71493 17.2929 6.70739L17.2879 6.70208C16.9024 6.31117 16.904 5.68176 17.2929 5.29291ZM15.2929 8.29291C15.6834 7.90238 16.3166 7.90238 16.7071 8.29291L16.7085 8.29434L16.7101 8.29587L16.7134 8.29923L16.7211 8.30715L16.7408 8.32779C16.7557 8.34369 16.7741 8.36388 16.7955 8.38838C16.8384 8.43736 16.8934 8.50371 16.9563 8.58751C17.0818 8.75498 17.2397 8.99329 17.3944 9.3028C17.7056 9.92509 18 10.8272 18 12C18 13.1728 17.7056 14.0749 17.3944 14.6972C17.2397 15.0067 17.0818 15.2451 16.9563 15.4125C16.8934 15.4963 16.8384 15.5627 16.7955 15.6116C16.7741 15.6361 16.7557 15.6563 16.7408 15.6722L16.7211 15.6929L16.7134 15.7008L16.7101 15.7042L16.7085 15.7057L16.7078 15.7064C16.3173 16.0969 15.6834 16.0976 15.2929 15.7071C14.9057 15.32 14.9024 14.6943 15.2829 14.303C15.2843 14.3015 15.2868 14.2987 15.2904 14.2946C15.3022 14.2811 15.3253 14.2537 15.3562 14.2125C15.4182 14.13 15.5103 13.9933 15.6056 13.8028C15.7944 13.4251 16 12.8272 16 12C16 11.1728 15.7944 10.5749 15.6056 10.1972C15.5103 10.0067 15.4182 9.87005 15.3562 9.78751C15.3253 9.74631 15.3022 9.71892 15.2904 9.70539C15.2868 9.70132 15.2843 9.69852 15.2829 9.69701C14.9024 9.30574 14.9057 8.68008 15.2929 8.29291Z"></path>
        </symbol>
        <symbol id="icon-play" viewBox="0 0 24 24">
            <path d="M6 6.74105C6 5.19747 7.67443 4.23573 9.00774 5.01349L18.0231 10.2725C19.3461 11.0442 19.3461 12.9558 18.0231 13.7276L9.00774 18.9865C7.67443 19.7643 6 18.8026 6 17.259V6.74105ZM17.0154 12L8 6.74105V17.259L17.0154 12Z"></path>
        </symbol>
        <symbol id="icon-pause" viewBox="0 0 24 24">
            <path d="M9 6C9.55228 6 10 6.44772 10 7V17C10 17.5523 9.55228 18 9 18C8.44772 18 8 17.5523 8 17V7C8 6.44772 8.44772 6 9 6ZM15 6C15.5523 6 16 6.44772 16 7V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V7C14 6.44772 14.4477 6 15 6Z"></path>
        </symbol>
        <symbol id="icon-screen" viewBox="0 0 24 24">
            <path d="M2 5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V16C22 17.1046 21.1046 18 20 18H13V20H16C16.5523 20 17 20.4477 17 21C17 21.5523 16.5523 22 16 22H8C7.44772 22 7 21.5523 7 21C7 20.4477 7.44772 20 8 20H11V18H4C2.89543 18 2 17.1046 2 16V5ZM20 16V5H4V16H20Z"></path>
        </symbol>
        <symbol id="icon-loading" viewBox="0 0 32 32">
            <path d="M16 32c-4.274 0-8.292-1.664-11.314-4.686s-4.686-7.040-4.686-11.314c0-3.026 0.849-5.973 2.456-8.522 1.563-2.478 3.771-4.48 6.386-5.791l1.344 2.682c-2.126 1.065-3.922 2.693-5.192 4.708-1.305 2.069-1.994 4.462-1.994 6.922 0 7.168 5.832 13 13 13s13-5.832 13-13c0-2.459-0.69-4.853-1.994-6.922-1.271-2.015-3.066-3.643-5.192-4.708l1.344-2.682c2.615 1.31 4.824 3.313 6.386 5.791 1.607 2.549 2.456 5.495 2.456 8.522 0 4.274-1.664 8.292-4.686 11.314s-7.040 4.686-11.314 4.686z">
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="rotate"
                    from="0 16 16"
                    to="360 16 16"
                    dur="1s"
                    additive="sum"
                    repeatCount="indefinite"
                />
            </path>
        </symbol>
        <symbol id="icon-more" viewBox="0 0 24 24">
            <path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z"></path>
            <path d="M10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6Z"></path>
            <path d="M10 18C10 19.1046 10.8954 20 12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18Z"></path>
        </symbol>
        <symbol id="icon-folder-add" viewBox="0 0 24 24">
            <path d="M2 6C2 4.89543 2.89543 4 4 4H9C9.26522 4 9.51957 4.10536 9.70711 4.29289L11.4142 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6ZM8.58579 6L4 6V18H20V8H11C10.7348 8 10.4804 7.89464 10.2929 7.70711L8.58579 6ZM12 10C12.5523 10 13 10.4477 13 11V12H14C14.5523 12 15 12.4477 15 13C15 13.5523 14.5523 14 14 14H13V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V14H10C9.44772 14 9 13.5523 9 13C9 12.4477 9.44772 12 10 12H11V11C11 10.4477 11.4477 10 12 10Z"></path>
        </symbol>
        <symbol id="icon-account" viewBox="0 0 24 24">
            <path d="M6 17.016v0.984h12v-0.984c0-2.016-3.984-3.094-6-3.094s-6 1.078-6 3.094zM15 9c0-1.641-1.359-3-3-3s-3 1.359-3 3 1.359 3 3 3 3-1.359 3-3zM3 5.016c0-1.078 0.891-2.016 2.016-2.016h13.969c1.078 0 2.016 0.938 2.016 2.016v13.969c0 1.078-0.938 2.016-2.016 2.016h-13.969c-1.125 0-2.016-0.938-2.016-2.016v-13.969z" />
        </symbol>
        <symbol id="icon-chevron-up" viewBox="0 0 24 24">
            <path d="M12 8.016l6 6-1.406 1.406-4.594-4.594-4.594 4.594-1.406-1.406z" />
        </symbol>
        <symbol id="icon-chevron-down" viewBox="0 0 24 24">
            <path d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z"></path>
        </symbol>
        <symbol id="icon-chevron-left" viewBox="0 0 24 24">
            <path d="M14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L9.41421 12L14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289Z"></path>
        </symbol>
        <symbol id="icon-chevron-right" viewBox="0 0 24 24">
            <path d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z"></path>
        </symbol>
        <svg id="icon-expand" viewBox="0 0 24 24">
            <path d="M6 7.41421V9C6 9.55229 5.55228 10 5 10C4.44772 10 4 9.55229 4 9L4 5C4 4.44772 4.44772 4 5 4L9 4C9.55229 4 10 4.44772 10 5C10 5.55228 9.55229 6 9 6H7.41421L9.70711 8.29289C10.0976 8.68342 10.0976 9.31658 9.70711 9.70711C9.31658 10.0976 8.68342 10.0976 8.29289 9.70711L6 7.41421ZM15 6C14.4477 6 14 5.55229 14 5C14 4.44772 14.4477 4 15 4H19C19.5523 4 20 4.44772 20 5V9.00001C20 9.55229 19.5523 10 19 10C18.4477 10 18 9.55229 18 9.00001V7.41421L15.7071 9.70711C15.3166 10.0976 14.6834 10.0976 14.2929 9.70711C13.9024 9.31658 13.9024 8.68342 14.2929 8.29289L16.5858 6H15ZM5 14C5.55228 14 6 14.4477 6 15L6 16.5858L8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929C10.0976 14.6834 10.0976 15.3166 9.70711 15.7071L7.41421 18H9C9.55228 18 10 18.4477 10 19C10 19.5523 9.55228 20 9 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19L4 15C4 14.4477 4.44772 14 5 14ZM14.2929 15.7071C13.9024 15.3166 13.9024 14.6834 14.2929 14.2929C14.6834 13.9024 15.3166 13.9024 15.7071 14.2929L18 16.5858V15C18 14.4477 18.4477 14 19 14C19.5523 14 20 14.4477 20 15V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19C14 18.4477 14.4477 18 15 18H16.5858L14.2929 15.7071Z"></path>
        </svg>
        <symbol id="icon-delete" viewBox="0 0 24 24">
            <path d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18.9897C18.9959 5.99994 19.0021 5.99994 19.0083 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H19.9311L19.0638 20.1425C18.989 21.1891 18.1182 22 17.0689 22H6.93112C5.88184 22 5.01096 21.1891 4.9362 20.1425L4.06888 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H4.99174C4.99795 5.99994 5.00414 5.99994 5.01032 6H7V4ZM9 6H15V4H9V6ZM6.07398 8L6.93112 20H17.0689L17.926 8H6.07398ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z"></path>
        </symbol>
        <symbol id="icon-prompt" viewBox="0 0 24 24">
            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"></path>
            <path d="M15.047 11.25q0.938-0.938 0.938-2.25 0-1.641-1.172-2.813t-2.813-1.172-2.813 1.172-1.172 2.813h1.969q0-0.797 0.609-1.406t1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406l-1.219 1.266q-1.172 1.266-1.172 2.813v0.516h1.969q0-1.547 1.172-2.813zM12.984 18.984v-1.969h-1.969v1.969h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path>
        </symbol>
        <symbol id="icon-folder" viewBox="0 0 24 24">
            <path d="M2 6C2 4.89543 2.89543 4 4 4H9C9.26522 4 9.51957 4.10536 9.70711 4.29289L11.4142 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6ZM8.58579 6L4 6V18H20V8H11C10.7348 8 10.4804 7.89464 10.2929 7.70711L8.58579 6Z"></path>
        </symbol>
        <symbol id="icon-lock" viewBox="0 0 24 24">
            <path
                fillRule="evenodd"
                d="M12 4C10.3523 4 9 5.35228 9 7V10H15V7C15 5.35228 13.6477 4 12 4ZM17 10V7C17 4.24772 14.7523 2 12 2C9.24771 2 7 4.24772 7 7V10H6C4.89543 10 4 10.8954 4 12V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V12C20 10.8954 19.1046 10 18 10H17ZM6 12V20H18V12H6Z"
            ></path>
        </symbol>
        <symbol id="icon-error" viewBox="0 0 24 24">
            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM7.79289 7.79289C8.18342 7.40237 8.81658 7.40237 9.20711 7.79289L12 10.5858L14.7929 7.79289C15.1834 7.40237 15.8166 7.40237 16.2071 7.79289C16.5976 8.18342 16.5976 8.81658 16.2071 9.20711L13.4142 12L16.2071 14.7929C16.5976 15.1834 16.5976 15.8166 16.2071 16.2071C15.8166 16.5976 15.1834 16.5976 14.7929 16.2071L12 13.4142L9.20711 16.2071C8.81658 16.5976 8.18342 16.5976 7.79289 16.2071C7.40237 15.8166 7.40237 15.1834 7.79289 14.7929L10.5858 12L7.79289 9.20711C7.40237 8.81658 7.40237 8.18342 7.79289 7.79289Z"></path>
        </symbol>
        <symbol id="icon-devices" viewBox="0 0 24 24">
            <path d="M21.984 17.016v-7.031h-3.984v7.031h3.984zM23.016 8.016q0.422 0 0.703 0.281t0.281 0.703v9.984q0 0.422-0.281 0.727t-0.703 0.305h-6q-0.422 0-0.727-0.305t-0.305-0.727v-9.984q0-0.422 0.305-0.703t0.727-0.281h6zM3.984 6v11.016h10.031v3h-14.016v-3h2.016v-11.016q0-0.797 0.586-1.406t1.383-0.609h18v2.016h-18z" />
        </symbol>
        <symbol id="icon-share" viewBox="0 0 48 48">
            <path d="M36 32.156c3.188 0 5.813 2.625 5.813 5.813s-2.625 5.906-5.813 5.906-5.813-2.719-5.813-5.906c0-0.469 0-0.938 0.094-1.313l-14.156-8.25c-1.125 1.031-2.531 1.594-4.125 1.594-3.281 0-6-2.719-6-6s2.719-6 6-6c1.594 0 3 0.563 4.125 1.594l14.063-8.156c-0.094-0.469-0.188-0.938-0.188-1.406 0-3.281 2.719-6 6-6s6 2.719 6 6-2.719 6-6 6c-1.594 0-3-0.656-4.125-1.688l-14.063 8.25c0.094 0.469 0.188 0.938 0.188 1.406s-0.094 0.938-0.188 1.406l14.25 8.25c1.031-0.938 2.438-1.5 3.938-1.5z" />
        </symbol>
    </svg>
);

export default Sprite;
