export default function getThumbnail(thumbnails = {}, size = 'default') {
    const { url = '' } = thumbnails[size] || {};

    return url.replace('http:', 'https:');
}
