export default function getThumbnail(thumbnails, size = 'default') {
  return thumbnails[size].url.replace('http:', 'https:')
}
