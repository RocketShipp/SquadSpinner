'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _LobbyModel = require('../../models/LobbyModel');

var _LobbyModel2 = _interopRequireDefault(_LobbyModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// With given 'lobbyId' request params, return lobby from DB
var getLobby = function getLobby(req, res, done) {
  _LobbyModel2.default.findOne({ shortId: req.params.shortId }).exec().then(function (lobby) {
    if (lobby === null) {
      return done('This lobby doesn\'t exist or has been deleted.');
    } else {
      return res.json({ success: true, lobby: lobby });
    }
  }).catch(function (err) {
    return done('This lobby doesn\'t exist or has been deleted.');
  });
};

// Query lobbies in DB with given lobby_id in URL params
// Fill request body with new information or leave old info
// If user is the owner of the lobby, update the lobby in the DB
// Returns success message and updated lobby
var updateLobbySettings = function updateLobbySettings(req, res, done) {
  var user = req.user._id;
  var set = req.body;
  var shortId = req.params.shortId;
  var updatedSettings = {};

  // Find lobby by given ID
  _LobbyModel2.default.findOne({ shortId: shortId }).exec().then(function (lobby) {
    String(lobby.users.ownerId) !== String(user) ? done('You must own this lobby to edit settings.') : null;
    // Make sure all required request fields were provided
    if (set.hideVideoPlayer == undefined || set.voteToSkip.voteToSkipEnabled == undefined || set.voteToSkip.requiredVotesToSkip == undefined) {
      return done('Each lobby setting must be provided -- refer to API guide.');
    } else {
      // Replace any lobby settings with provided settings from request
      set.hideVideoPlayer !== undefined ? lobby.settings.hideVideoPlayer = set.hideVideoPlayer : null;
      set.voteToSkip.voteToSkipEnabled !== undefined ? lobby.settings.voteToSkip.voteToSkipEnabled = set.voteToSkip.voteToSkipEnabled : null;
      set.voteToSkip.requiredVotesToSkip ? lobby.settings.voteToSkip.requiredVotesToSkip = set.voteToSkip.requiredVotesToSkip : null;

      // Update the lobby settings
      _LobbyModel2.default.findOneAndUpdate({ shortId: shortId }, lobby).then(function (oldLobby) {
        // Return updated lobby
        res.json({ success: true, lobby: lobby });
      }).catch(function (err) {
        return done('Error updating lobby settings.');
      });
    }
  }).catch(function (err) {
    return done('Could not find lobby.');
  });
};

var updateLobbyPlaylist = function updateLobbyPlaylist(req, res, done) {
  var user = req.user._id;
  var set = req.body;
  var shortId = req.params.shortId;

  _LobbyModel2.default.findOne({ shortId: shortId }).exec().then(function (lobby) {
    // Check if user owns the lobby
    String(lobby.users.ownerId) !== String(user) ? done('You must own this lobby to edit playlist.') : null;
    lobby.playlist = set.playlist;
    // Update lobby and return success message and lobby object
    _LobbyModel2.default.findOneAndUpdate({ shortId: shortId }, lobby).then(function (oldLobby) {
      return res.json({ success: true, lobby: lobby, message: 'Playlist updated.' });
    }).catch(function (err) {
      return done('Error updating playlist.');
    });
  }).catch(function (err) {
    return done('Error finding lobby.');
  });
};

// Find lobby by lobby_id given in URL params
// Check to see if the request is coming from the lobby owner
// Remove the song from lobby.playlist array with id given in URL params
// Update lobby
// Return success message and updated lobby
var removeSong = function removeSong(req, res, done) {
  var user = req.user;
  var lobbyId = req.params.shortId;
  var songId = req.params.song_id;

  _LobbyModel2.default.findOne({ shortId: lobbyId }).exec().then(function (foundLobby) {
    // If the user from token is not the owner of the found lobby,
    // Return error message
    if (user._id.toJSON() !== foundLobby.users.ownerId.toJSON()) {
      return done('You must own this lobby to remove a song!');
    }
    var playlistIdMap = foundLobby.playlist.map(function (song) {
      return song._id.toJSON();
    });
    var indexOfSong = playlistIdMap.indexOf(songId);
    var songExistsInPlaylist = indexOfSong >= 0;
    var songTitle = foundLobby.playlist[indexOfSong].songTitle;

    if (songExistsInPlaylist) {
      // Remove song from playlist
      foundLobby.playlist.splice(indexOfSong, 1);
      // Update lobby
      _LobbyModel2.default.findOneAndUpdate({ shortId: lobbyId }, foundLobby).exec().catch(function (err) {
        return done('Could not remove ' + songTitle + ' from ' + foundLobby.lobbyName + '.');
      });

      return res.json({ success: true, message: songTitle + ' removed.', lobby: foundLobby });
    } else {
      return res.json({ message: 'Your playlist does not contain this song, or it has already been removed.' });
    }
  }).catch(function (err) {
    return done('Cannot remove song because the lobby was not found.');
  });
};

var lobbyController = { getLobby: getLobby, updateLobbySettings: updateLobbySettings, removeSong: removeSong, updateLobbyPlaylist: updateLobbyPlaylist };

exports.default = lobbyController;