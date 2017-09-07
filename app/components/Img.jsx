class Img extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false
    }
  }

  componentDidMount() {
    this.loadImage(this.props.src)
    .then(() => {
      this.setState({ isLoaded: true })
    })
  }

  loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => resolve(img)
    img.onerror = (error) => reject(console.error('Error: ', error))

    img.src = src
  })

  render() {
    const { isLoaded } = this.state
    const { className, src, alt = 'image', background } = this.props
    return (
      <figure className={['image', isLoaded ? 'loaded' : ''].join(' ')}>
        {background ? (
          <div className='image-background' style={{ backgroundImage: `url(${src})`}}></div>
        ) : (
          <img src={src} alt={alt}></img>
        )}

        <span className='image-loader'>
          <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </span>
      </figure>
    )
  }
}

export default Img
