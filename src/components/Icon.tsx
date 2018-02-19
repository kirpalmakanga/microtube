import { h } from 'preact'

interface Props {
  class?: String
  name: String
}

const Icon = ({ class: className = '', name = '' }: Props) => (
  <span class={['icon', className].join(' ')}>
    <svg>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  </span>
)

export default Icon
