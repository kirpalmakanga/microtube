// jshint esversion: 6, asi: true
// eslint-env es6

exports.addPlaylist = ({ body }, res) => {
  Youtube.playlists.insert({
    part: 'snippet, status',
    resource: {
      snippet: {
        title: body.title,
        description: body.description
      },
      status: {
        privacyStatus: 'unlisted'
      }
    }
  }, (err, data) => res.send({ status: err || data }))
}

exports.updatePlaylist = ({ body }, res) => {
  Youtube.playlists.update({
    part: 'snippet, status',
    resource: {
      id: body.id,
      snippet: {
        title: body.title,
        description: body.description
      },
      status: {
        privacyStatus: 'unlisted'
      }
    }
  }, (err, data) => res.send({ status: err || data }))
}

exports.deletePlaylist = ({ body }, res) => {
  Youtube.playlists.delete({ id: body.id }, (err, data) => res.send({ status: err || data }))
}


exports.addPlaylistItem = ({ body }, res) => {
  Youtube.playlists.insert({
    part: 'snippet, status',
    resource: {
      snippet: {
        playlistId: body.playlistId,
        resourceId: {
          videoId: body.videoId
        }
      },
      status: {
        privacyStatus: 'unlisted'
      }
    }
  }, (err, data) => res.send({ status: err || data }))
}

exports.updatePlaylistItem = ({ body }, res) => {
  Youtube.playlists.update({
    part: 'snippet, status',
    resource: {
      id: body.id,
      snippet: {
        playlistId: body.playlistId,
        resourceId: {
          videoId: body.videoId
        }
      }
    }
  }, (err, data) => res.send({ status: err || data }))
}

exports.deletePlaylistItem = ({ body }, res) => {
  Youtube.playlists.update({ id: body.id }, (err, data) => res.send({ status: err || data }))
}

//Get single video
exports.getVideo = ({ params }, res) => {
  Youtube.videos.list({
    id: params.id,
    part: 'snippet',
    key: process.env.API_KEY
  }, (err, data) => {
    if (err) {
      return console.log(err)
    }
    return err ? console.log(err) : res.send(data)
  })
}
