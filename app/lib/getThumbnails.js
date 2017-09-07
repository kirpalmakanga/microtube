export default function getThumbnail(thumbnails, size) {
  if(size) {
      return thumbnails[size].url
  }

  if(thumbnails.highres) {
    return thumbnails.highres.url
  }

  if(thumbnails.standard) {
    return thumbnails.standard.url
  }

  if(thumbnails.medium) {
    return thumbnails.medium.url
  }

  if(thumbnails.high) {
    return thumbnails.high.url
  }

  return thumbnails.default.url
}
