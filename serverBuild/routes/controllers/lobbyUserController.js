'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _LobbyModel = require('../../models/LobbyModel');

var _LobbyModel2 = _interopRequireDefault(_LobbyModel);

var _UserModel = require('../../models/UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Create a new lobby object
// Save lobby to users's ownedLobbies array
// Save the new lobby
// Returns success message and lobbyId
var createLobby = function createLobby(req, res, done) {
  var lobbyOwner = req.user;
  var lobby = req.body;
  // Default settings
  var vtsEnabled = lobby.settings ? lobby.settings.voteToSkip.voteToSkipEnabled : false;
  var requiredVTS = lobby.settings ? lobby.settings.voteToSkip.requiredVotesToSkip : 0;
  var hideVP = lobby.settings ? lobby.settings.hideVideoPlayer : false;

  // Create new lobby object
  var newLobby = new _LobbyModel2.default({
    lobbyName: lobby.lobbyName,
    settings: {
      voteToSkip: {
        voteToSkipEnabled: vtsEnabled,
        requiredVotesToSkip: requiredVTS
      },
      hideVideoPlayer: hideVP
    },
    users: {
      ownerId: lobbyOwner._id,
      admins: [],
      joined: [],
      bannedUsers: []
    },
    playlist: []
  });
  newLobby.save().then(function (lobby) {
    // This will save the new lobby in the user.lobbiesJoined
    _UserModel2.default.findById({ _id: lobbyOwner._id }).exec().then(function (foundUser) {
      var newLobby = { _id: lobby._id, shortId: lobby.shortId, lobbyName: lobby.lobbyName };
      // Add new lobby to user.lobbiesOwned
      foundUser.lobbiesOwned = [].concat(_toConsumableArray(foundUser.lobbiesOwned), [newLobby]);
      // Update user object
      _UserModel2.default.findOneAndUpdate({ _id: lobbyOwner._id }, foundUser).exec().then(function (user) {
        // Respond with success message and lobbyId
        return res.json({ success: true, message: lobby.lobbyName + ' successfully created.', lobbyId: lobby._id, shortId: lobby.shortId });
      }).catch(function (err) {
        return done('Squad was created but user was not updated.');
      });
    }).catch(function (err) {
      return done(user.Username + ' not found, so ' + lobby.lobbyName + ' not saved to squads.');
    });
  }).catch(function (err) {
    return done('Could not save squad ' + newLobby.lobbyName + '.');
  });
};

// Make sure user is the owner before deleting lobby
// With given 'lobbyId' in request params, remove lobby from DB
// Then find the user from the token's userId
// Remove deleted lobby from owner's lobbiesOwned array
// Return success message and updated user
var deleteLobby = function deleteLobby(req, res, done) {
  var userId = req.user._id.toJSON();
  _LobbyModel2.default.findById({ _id: req.params.lobby_id }).exec().then(function (lobby) {
    var isOwner = lobby.users.ownerId.toJSON() === userId;

    if (isOwner) {
      // Delete lobby from DB if user is the lobby owner
      _LobbyModel2.default.findByIdAndRemove({ _id: lobby._id }).then(function () {
        return console.log(req.user.userName + ' has successfully deleted ' + lobby.lobbyName + '.');
      }).catch(function (err) {
        return done('Error deleting lobby ' + lobby.lobbyName);
      });
      // Delete the lobby object from the user.lobbiesOwned
      _UserModel2.default.findById({ _id: userId }).exec().then(function (foundUser) {
        var lobbiesOwnedMap = foundUser.lobbiesOwned.map(function (mappedLobby) {
          return mappedLobby._id.toJSON();
        });
        var indexOfOwnedLobby = lobbiesOwnedMap.indexOf(lobby._id.toJSON());
        var lobbyExists = indexOfOwnedLobby >= 0;
        var successResponse = res.json({ success: true, message: lobby.lobbyName + ' successfully deleted.', user: foundUser });
        // If the lobby exists in the user's lobbiesOwned array
        // Remove the lobby object from the user.lobbiesOwned
        // Update user and return success response
        if (lobbyExists) {
          foundUser.lobbiesOwned.splice(indexOfOwnedLobby, 1);
          _UserModel2.default.findOneAndUpdate({ _id: userId }, foundUser).then(function (user) {
            return successResponse;
          }).catch(function (err) {
            return done('Error deleting lobby ' + lobby.lobbyName + ' from ' + req.user.userName + '\'s owned lobbies.\'');
          });
        } else {
          return successResponse;
        }
      }).catch(function (err) {
        return done('Error trying to find user. Couldn\'t remove lobby ' + lobby.lobbyName + ' from ' + req.user.userName + '\'s owned lobbies.');
      });
    } else {
      return res.json({ success: false, message: "You must own this lobby to delete it." });
    }
  }).catch(function (err) {
    return done('Lobby does not exist or has already been deleted.');
  });
};

// Check if user is already joined or banned from lobby
// If not, update the lobby with user from decoded token
// And update user object with joined lobbyId
// Respond with success message and updated lobby
var joinLobby = function joinLobby(req, res, done) {
  var user = req.user;
  var shortId = req.params.shortId;
  _LobbyModel2.default.findOne({ shortId: shortId }).exec().then(function (lobby) {
    var joinedUsersArray = lobby.users.joined.map(function (user) {
      return user._id.toJSON();
    });
    var bannedUsersArray = lobby.users.bannedUsers.map(function (user) {
      return user._id.toJSON();
    });
    var isJoined = joinedUsersArray.indexOf(user._id.toJSON()) >= 0;
    var isBanned = bannedUsersArray.indexOf(user._id.toJSON()) >= 0;
    var isOwner = req.user._id.toString() === lobby.users.ownerId.toString();

    // If the user is the owner of the lobby, return error message
    if (isOwner) return done('You already own ' + lobby.lobbyName + '.');

    if (isBanned) return done('You have been banned from this squad.', false);

    // Add user to the modifiedLobby array lobby.users.joined
    var modifiedLobby = lobby;
    modifiedLobby.users.joined = [].concat(_toConsumableArray(modifiedLobby.users.joined), [{ _id: _mongoose.Types.ObjectId(user._id), userName: user.userName }]);

    // Add lobbyId to user.joinedLobbies
    var modifiedUser = user;
    modifiedUser.lobbiesJoined = [].concat(_toConsumableArray(modifiedUser.lobbiesJoined), [{
      _id: _mongoose.Types.ObjectId(lobby.lobby_id),
      shortId: shortId,
      lobbyName: lobby.lobbyName
    }]);

    // Update lobby with modified lobby
    _LobbyModel2.default.findOneAndUpdate({ shortId: shortId }, modifiedLobby).exec().catch(function (err) {
      return done('Error trying to add you to squad user list.', false);
    });

    // Now update the User object with a new joined lobbyId
    _UserModel2.default.findOneAndUpdate({ _id: user._id }, modifiedUser).exec().then(function (user) {
      return res.json({ success: true, message: user.userName + ' succesfully joined ' + lobby.lobbyName + '!', lobby: modifiedLobby });
    }).catch(function (err) {
      return done('Couldn\'t add squad to your joined squads list because your account couldn\'t be found.');
    });
  }).catch(function (err) {
    return done('Squad does not exist!');
  });
};

// Check if user from token is the owner of queried lobby
// Check is user is already joined or banned from lobby
// Move user from lobby.users.joined to lobby.users.bannedUsers
// Respond with success message and updated lobby
var banUser = function banUser(req, res, done) {
  var tokenUserId = req.user._id;
  var userToBan = null;
  var lobbyId = req.params.lobby_id;
  var mayBanUser = false;

  _UserModel2.default.findById({ _id: req.params.user_id }).exec().then(function (user) {
    // Set userToBan to this found user
    userToBan = user;
  }).catch(function (err) {
    return done('Couldn\'t ban that user because it doesn\'t exist!');
  });

  _LobbyModel2.default.findOne({ _id: lobbyId }).exec().then(function (lobby) {

    // Check to see if user in token owns the lobby
    if (tokenUserId.toJSON() !== lobby.users.ownerId.toJSON()) {
      return done('You must own this lobby to ban a user.');
    }

    // Get index of the user to be banned in the lobby's joined users
    var joinedUserMap = lobby.users.joined.map(function (user) {
      return user._id.toJSON();
    });
    var indexOfBannableUser = joinedUserMap.indexOf(userToBan._id.toJSON());
    var userIsJoined = indexOfBannableUser >= 0;

    // Check to see if the user is in the lobby's joined users
    if (!userIsJoined) return done('That user is not in this lobby or has already been banned.');

    // Remove user from users.joined
    lobby.users.joined.splice(indexOfBannableUser, 1);
    // Add the banned user to the lobby's bannedUsers
    lobby.users.bannedUsers = [].concat(_toConsumableArray(lobby.users.bannedUsers), [{
      _id: userToBan._id,
      userName: userToBan.userName
    }]);

    // Now update the lobby
    _LobbyModel2.default.findOneAndUpdate({ _id: lobby._id }, lobby).exec().catch(function (err) {
      return done('Cannot ban user because the lobby failed to update.');
    });

    // Respond with success message
    return res.json({ success: true, message: req.user.userName + ' banned ' + userToBan.userName + ' from ' + lobby.lobbyName + '.', lobby: lobby });
  }).catch(function (err) {
    return done('Couldn\'t ban that user because the lobby does not exist!');
  });
};

// Check if user from token is the owner of queried lobby
// Check if user is already banned from lobby
// Remove user from lobby.users.bannedUsers
// Return success message and updated lobby
var unbanUser = function unbanUser(req, res, done) {
  var tokenUserId = req.user._id;
  var userToUnban = null;
  var lobbyId = req.params.lobby_id;
  var mayUnbanUser = false;

  _UserModel2.default.findById({ _id: req.params.user_id }).exec().then(function (user) {
    // Set userToUnban to this found user
    userToUnban = user;
  }).catch(function (err) {
    return done('Couldn\'t unban that user because it doesn\'t exist!');
  });

  _LobbyModel2.default.findById({ _id: lobbyId }).exec().then(function (lobby) {

    // Check to see if user in token owns the lobby
    if (tokenUserId.toJSON() !== lobby.users.ownerId.toJSON()) {
      return done('You must own this lobby to unban a user.');
    }

    // Get index of the user to be unbanned from the lobby's banned users
    var bannedUserMap = lobby.users.bannedUsers.map(function (bannedUser) {
      return bannedUser._id.toJSON();
    });
    var indexOfBannedUser = bannedUserMap.indexOf(userToUnban._id.toJSON());
    var userIsBanned = indexOfBannedUser >= 0;

    // Check to see if the user is in the lobby's users.bannedUsers array
    if (!userIsBanned) return done(userToUnban.userName + ' was not found in the banned users list of ' + lobby.lobbyName + '.');

    // Remove user from bannedUsers array
    lobby.users.bannedUsers.splice(indexOfBannedUser, 1);

    // Now update the lobby
    _LobbyModel2.default.findOneAndUpdate({ _id: lobby._id }, lobby).exec().catch(function (err) {
      return done('Cannot unban user because the lobby failed to update.');
    });

    // Respond with success message
    return res.json({ success: true, message: req.user.userName + ' unbanned ' + userToUnban.userName + ' from ' + lobby.lobbyName + '.', lobby: lobby });
  }).catch(function (err) {
    return done('Couldn\'t unban that user because the lobby does not exist!');
  });
};

// Find lobby by id
// Add user details to song request body
// Check to see if user is owner or joined
// Check to see if the song URL isn't already queued
// Add song to old lobby playlist
// Update lobby with new playlist
// Return success message and updated lobby
var queueSong = function queueSong(req, res, done) {
  var user = req.user;
  var song = req.body;
  var shortId = req.params.shortId;

  // Find lobby by id in the request URL parameters
  _LobbyModel2.default.findOne({ shortId: shortId }).exec().then(function (oldLobby) {
    // Check to see if user owns or is in the lobby
    var joinedUserMap = oldLobby.users.joined.map(function (user) {
      return user._id.toJSON();
    });
    var isOwner = user._id.toJSON() === oldLobby.users.ownerId.toJSON();
    var isInLobby = joinedUserMap.indexOf(user._id.toJSON()) >= 0;
    var allowedToQueue = isOwner || isInLobby;

    // If user isn't owner or in lobby, return false success message
    if (!allowedToQueue) return done('You must join this squad to queue media.', false);

    // Make sure song URL isn't already in the queue
    var playlistUrls = oldLobby.playlist.map(function (song) {
      return song.songUrl;
    });
    var alreadyQueued = playlistUrls.indexOf(song.songUrl) >= 0;
    if (alreadyQueued) return done('This is already in the queue!', false);

    // Add user details to request body
    song.addedByUser = { _id: user._id, userName: user.userName };

    // Add song to existing playlist
    oldLobby.playlist = [].concat(_toConsumableArray(oldLobby.playlist), [song]);

    // Update the lobby's playlist
    _LobbyModel2.default.findOneAndUpdate({ shortId: shortId }, oldLobby).exec().then(function (lobby) {
      return res.json({ success: true, message: user.userName + ' queued ' + song.songTitle + '.', playlist: oldLobby.playlist });
    }).catch(function (err) {
      return done(err, false);
    });
  }).catch(function (err) {
    return done('Lobby does not exist or has been deleted.');
  });
};

// Find lobby by id but if it doesn't exist,
// Remove the lobby from user.lobbiesJoined and return success message
// If the loby exists, you can only leave if you ARE NOT the owner
// Remove user from lobby object and remove lobby from user object
// Return success message with updated user
var leaveLobby = function leaveLobby(req, res, done) {
  var shortId = req.params.shortId;
  var user = req.user;
  function removeLobbyFromUser() {
    // Check user.joinedLobbies for queried shortId
    _UserModel2.default.findById({ _id: user._id }).exec().then(function (foundUser) {
      var shortIdMap = foundUser.lobbiesJoined.map(function (lobby) {
        return lobby.shortId;
      });
      var indexOfJoinedLobby = shortIdMap.indexOf(shortId);
      var userHasJoinedLobby = indexOfJoinedLobby >= 0;
      var lobbyName = foundUser.lobbiesJoined[indexOfJoinedLobby].lobbyName;

      // If the user has this shortId in their joinedLobbies, remove it
      if (userHasJoinedLobby) {
        // Remove lobby from user.joinedLobbies
        foundUser.lobbiesJoined.splice(indexOfJoinedLobby, 1);
        // Update user
        _UserModel2.default.findOneAndUpdate({ _id: user._id }, foundUser).exec().catch(function (err) {
          return done('Cannot remove lobby from your lobbiesJoined array.', false);
        });

        return res.json({ success: true, message: 'You have successfully left ' + lobbyName + '.', user: foundUser });
      } else {
        // If the user doesn't have this shortId in ther joinedLobbies
        // Return error message
        return done('You dont have this lobby saved in your joined lobbies.');
      }
    }).catch(function (err) {
      return done('Cannot find user ' + user.userName + ' in DB.', false);
    });
  }

  // Check to see if the lobby exists
  _LobbyModel2.default.findOne({ shortId: shortId }).exec().then(function (foundLobby) {
    // Lobby exists, continue on
    var joinedUserMap = foundLobby.users.joined.map(function (user) {
      return user._id.toJSON();
    });
    var indexOfUser = joinedUserMap.indexOf(user._id.toJSON());
    var userExistsInLobby = indexOfUser >= 0;
    var isLobbyOwner = user._id.toJSON() === foundLobby.users.ownerId.toJSON();

    // If the user is the lobbyOwner, return error message
    if (isLobbyOwner) return done('You cannot leave the lobby you own, you must delete it.');

    // If the user is in the lobby.users.joined, remove user
    if (userExistsInLobby) {
      foundLobby.users.joined.splice(indexOfUser, 1);
      // Update lobby
      _LobbyModel2.default.findOneAndUpdate({ shortId: shortId }, foundLobby).exec().catch(function (err) {
        return done('Cannot remove user ' + user.userName + ' from lobby ' + foundLobby.lobbyName + '.', false);
      });
    }
  }).then(removeLobbyFromUser()).catch(function (err) {
    // If the lobby doesn't exist
    // Remove lobby object from users.lobbiesJoined
    removeLobbyFromUser();
  });
};

var lobbyUserController = { joinLobby: joinLobby, banUser: banUser, unbanUser: unbanUser, queueSong: queueSong, leaveLobby: leaveLobby, deleteLobby: deleteLobby, createLobby: createLobby };

exports.default = lobbyUserController;