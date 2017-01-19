// jshint esversion: 6, asi: true
// eslint-env es6

const Youtube = require('youtube-api')
const fs = require('fs')
const fetch = require('fetch-ponyfill')({ Promise: Promise })

function authenticate(token, callback) {
  Youtube.authenticate({ type: 'oauth', token })

  callback(Youtube)
}

// Playlists
exports.getPlaylists = ({ params, headers, cookies, accessToken }, res) => {
  authenticate(accessToken, api => {
    api.playlists.list({
      pageToken: params.pageId,
      part: 'snippet, status',
      mine: true,
      maxResults: 25,
      key: process.env.API_KEY
    }, (err, data) => {

      if (err) {
        console.log(err)

        return res.status(500).send({ error: 'Error: Gathering playlists failed.' })
      }

      let { items, nextPageToken, pageInfo } = data

      return res.send({
        items: items.map(({ id, snippet, status }) => ({
          id,
          title: snippet.title,
          privacyStatus: status.privacyStatus
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    })
  })
}

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

//Playlist Items
exports.getPlaylistItems = ({ params }, res) => {
  Youtube.playlistItems.list({
    playlistId: params.id,
    pageToken: params.pageId,
    part: 'snippet, status',
    maxResults: 50,
    key: process.env.API_KEY
  }, (err, data) => {

    if (err) {
      return res.status(500).send({ error: 'Error: Gathering playlist items failed.' })
    }

    let { items, nextPageToken, pageInfo } = data

    return res.send({
      items: items.map(({ id, snippet, status }) => ({
        id,
        videoId: snippet.resourceId.videoId,
        title: snippet.title,
        publishedAt: snippet.publishedAt,
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        privacyStatus: status.privacyStatus
      })),
      nextPageToken,
      totalResults: pageInfo.totalResults
    })
  })
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


//Search
exports.searchVideos = ({ params }, res) => {
  Youtube.search.list({
    part: 'snippet',
    type: 'video',
    q: params.terms,
    pageToken: params.pageId,
    key: process.env.API_KEY,
    maxResults: 50,
  }, (err, data) => {
    if (err) {
      return res.status(500).send({ error: 'Error: Searching items failed.' })
    }

    let { items, nextPageToken, pageInfo } = data

    return res.send({
      items: items.map(({ id, snippet, status }) => ({
        videoId: id.videoId,
        title: snippet.title,
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt
      })),
      nextPageToken,
      totalResults: pageInfo.totalResults
    })
  })
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
