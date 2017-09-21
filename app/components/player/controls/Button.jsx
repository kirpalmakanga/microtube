import { h } from 'preact'

const Button = ({ className, icon, iconTransitionClass = '', badge, onClick }) => (
  <button
    class={className}
    onClick={onClick}
    data-badge={badge}
  >
    <span class={['icon', iconTransitionClass].join(' ')}>
      <svg><use xlinkHref={['#',icon].join('')}></use></svg>
    </span>
  </button>
)

export default Button
