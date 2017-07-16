const Button = ({ className, icon, iconTransitionClass = '', badge, onClick }) => (
  <button
    className={className}
    onClick={onClick}
    data-badge={badge}
  >
    <span className={['icon', iconTransitionClass].join(' ')}>
      <svg><use xlinkHref={['#',icon].join('')}></use></svg>
    </span>
  </button>
)

export default Button
