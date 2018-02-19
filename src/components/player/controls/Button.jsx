import { h } from 'preact'

const Button = ({ className, icon, iconTransitionClass = '', badge, onClick, ariaLabel }) => (
  <button
    class={className}
    onClick={onClick}
    aria-label={ariaLabel}
    data-badge={badge}
  >
    <span class={['icon', iconTransitionClass].join(' ')}>
      <svg><use xlinkHref={['#',icon].join('')}></use></svg>
    </span>
  </button>
)

export default Button
