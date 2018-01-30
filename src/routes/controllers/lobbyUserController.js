import jwt from 'jsonwebtoken';
import Lobby from '../../models/LobbyModel';
import User from '../../models/UserModel';
import mongoose, { Types } from 'mongoose';


// Create a new lobby object
// Save lobby to users's ownedLobbies array
// Save the new lobby
// Returns success message and lobbyId
const createLobby = ( req, res, done ) => {
  const lobbyOwner = req.user;
  const lobby = req.body;

  // Create new lobby object
  const newLobby = new Lobby({
    lobbyName: lobby.lobbyName,
    settings: {
      voteToSkip: {
        voteToSkipEnabled: lobby.settings.voteToSkip.voteToSkipEnabled,
        requiredVotesToSkip: lobby.settings.voteToSkip.requiredVotesToSkip
      },
      hideVideoPlayer: lobby.settings.hideVideoPlayer
    },
    users: {
      ownerId: lobbyOwner._id,
      admins: [],
      joined: [],
      bannedUsers: []
    },
    playlist: []
  })
  newLobby.save().then(lobby => {
    // Save the new lobby in the user.lobbiesJoined
    User.findById({ _id: lobbyOwner._id }).exec().then(foundUser => {
      const newLobby = { _id: lobby._id, lobbyName: lobby.lobbyName };
      // Add new lobby to user.lobbiesOwned
      foundUser.lobbiesOwned = [...foundUser.lobbiesOwned, newLobby];
      // Update user object
      User.findOneAndUpdate({ _id: lobbyOwner._id }, foundUser).exec().then(user => {
        // Respond with success message and lobbyId
        return res.json({success: true, message: `Lobby ${lobby.lobbyName} successfully created by ${user.userName}`, lobbyId: lobby._id, shortId: lobby.shortId});
      }).catch(err => done('Lobby was created but did not save to the user.'));
    }).catch((err) => done(`Could not find ${user.Username}, so ${lobby.lobbyName} could not be saved to their joined lobbies.`));
  })
  .catch(err => done(`Could not save lobby ${newLobby.lobbyName}.`));
}

// Make sure user is the owner before deleting lobby
// With given 'lobbyId' in request params, remove lobby from DB
// Then find the user from the token's userId
// Remove deleted lobby from owner's lobbiesOwned array
// Return success message and updated user
const deleteLobby = ( req, res, done ) => {
  const userId = req.user._id.toJSON();
  Lobby.findById({ _id: req.params.lobby_id }).exec().then( (lobby) => {
    const isOwner = (lobby.users.ownerId.toJSON() === userId);

    if (isOwner) {
      // Delete lobby from DB if user is the lobby owner
      Lobby.findByIdAndRemove({ _id: req.params.lobby_id }).then(() => {
        return console.log({ success: true, message: `${req.user.userName} has successfully deleted ${lobby.lobbyName}.` });
      }).catch(err => done(`Error deleting lobby ${lobby.lobbyName}`));
      // Delete the lobby object from the user.lobbiesOwned
      User.findById({ _id: userId }).exec().then(foundUser => {
        const lobbiesOwnedMap = foundUser.lobbiesOwned.map(mappedLobby => mappedLobby._id.toJSON());
        const indexOfOwnedLobby = lobbiesOwnedMap.indexOf(req.params.lobby_id);
        const lobbyExists = indexOfOwnedLobby >= 0;
        const successResponse = res.json({ success: true, message: `Lobby ${lobby.lobbyName} has been deleted from ${req.user.userName}'s owned lobbies. It has also been deleted permanently.'`, user: foundUser });
        // If the lobby exists in the user's lobbiesOwned array
        // Remove the deleted lobby object from the user.lobbiesOwned
        // Update user and return success response
        if (lobbyExists) {
          foundUser.lobbiesOwned.splice(indexOfOwnedLobby, 1);
          User.findOneAndUpdate({ _id: userId }, foundUser)
          .then(user => successResponse)
          .catch(err => done(`Error deleting lobby ${lobby.lobbyName} from user ${req.user.userName}'s owned lobbies.'`));
        } else {
          return successResponse;
        }
      })
      .catch(err => done(`Error trying to find user. Couldn't remove lobby ${lobby.lobbyName} from ${req.user.userName}'s owned lobbies.`));
    } else {
      return res.json({ success: false, message: "You must own this lobby to delete it." })
    }
  }).catch(err => done('Lobby does not exist or has already been deleted.'));
}

// Check if user is already joined or banned from lobby
// If not, update the lobby with user from decoded token
// And update user object with joined lobbyId
// Respond with success message and updated lobby
const joinLobby = ( req, res, done ) => {
  const user = req.user;
  Lobby.findOne({ _id: req.params.lobby_id }).exec().then(lobby => {
    const joinedUsersArray = lobby.users.joined.map(user => user._id.toJSON());
    const bannedUsersArray = lobby.users.bannedUsers.map(user => user._id.toJSON());
    const isJoined = joinedUsersArray.indexOf(user._id.toJSON()) >= 0;
    const isBanned = bannedUsersArray.indexOf(user._id.toJSON()) >= 0;

    // If the user is in lobby, check to see if the name has changed
    // If the name has changed, update it in user.lobbiesJoined
    if (isJoined) {
      User.findById({ _id: user._id }).exec().then(foundUser => {
        const lobbiesJoinedIds = foundUser.lobbiesJoined.map(lobby => lobby._id.toJSON());
        const joinedLobbyIndex = lobbiesJoinedIds.indexOf(lobby._id.toJSON());

        const hasLobbyNameChanged = foundUser.lobbiesJoined[joinedLobbyIndex].lobbyName !== lobby.lobbyName;

        if (hasLobbyNameChanged) {
          foundUser.lobbiesJoined[joinedLobbyIndex].lobbyName = lobby.lobbyName;
          User.findOneAndUpdate({ _id: user._id }, foundUser).exec().catch((err) => done(`Couldn't update joined lobby name because the user was not found.`));
        }

      })
      return done('You are already in this lobby!', false);
    }
    if (isBanned) return done('You have been banned from this lobby.', false);

    // Add user to the modifiedLobby array lobby.users.joined
    let modifiedLobby = lobby;
    modifiedLobby.users.joined = [...modifiedLobby.users.joined, {_id: Types.ObjectId(user._id), userName: user.userName}];

    // Update lobby with modified lobby
    Lobby.findOneAndUpdate({ _id: req.params.lobby_id }, modifiedLobby).exec().catch((err) => done(err, false))


    // Add lobbyId to user.joinedLobbies
    let modifiedUser = user;
    modifiedUser.lobbiesJoined = [...modifiedUser.lobbiesJoined, {
      _id: Types.ObjectId(req.params.lobby_id),
      lobbyName: lobby.lobbyName
    }]

    // Now update the User object with a new joined lobbyId
    User.findOneAndUpdate({ _id: user._id }, modifiedUser).exec().then(user => res.json({ success: true, message: `${user.userName} succesfully joined ${lobby.lobbyName}!`, lobby: modifiedLobby }))
    .catch((err) => done(`Couldn't add lobby to your joined lobbies list because your account couldn't be found.`))

  }).catch((err) => done(`Couldn't join lobby because it does not exist!`));
}

// Check if user from token is the owner of queried lobby
// Check is user is already joined or banned from lobby
// Move user from lobby.users.joined to lobby.users.bannedUsers
// Respond with success message and updated lobby
const banUser = ( req, res, done ) => {
  const tokenUserId = req.user._id;
  let userToBan = null;
  const lobbyId = req.params.lobby_id;
  let mayBanUser = false;

  User.findById({ _id: req.params.user_id }).exec().then(user => {
    // Set userToBan to this found user
    userToBan = user;
  }).catch(err => done(`Couldn't ban that user because it doesn't exist!`));

  Lobby.findOne({ _id: lobbyId }).exec().then(lobby => {

    // Check to see if user in token owns the lobby
    if (tokenUserId.toJSON() !== lobby.users.ownerId.toJSON()) {
      return done('You must own this lobby to ban a user.');
    }

    // Get index of the user to be banned in the lobby's joined users
    const joinedUserMap = lobby.users.joined.map(user => user._id.toJSON());
    const indexOfBannableUser = joinedUserMap.indexOf(userToBan._id.toJSON());
    const userIsJoined = indexOfBannableUser >= 0;

    // Check to see if the user is in the lobby's joined users
    if (!userIsJoined) return done('That user is not in this lobby or has already been banned.');

    // Remove user from users.joined
    lobby.users.joined.splice(indexOfBannableUser, 1);
    // Add the banned user to the lobby's bannedUsers
    lobby.users.bannedUsers = [...lobby.users.bannedUsers, {
      _id: userToBan._id,
      userName: userToBan.userName
    }];

    // Now update the lobby
    Lobby.findOneAndUpdate({_id: lobby._id}, lobby).exec().catch(err => done('Cannot ban user because the lobby failed to update.'));

    // Respond with success message
    return res.json({ success: true, message: `${req.user.userName} banned ${userToBan.userName} from ${lobby.lobbyName}.`, lobby });
  })
  .catch(err => done(`Couldn't ban that user because the lobby does not exist!`));

}

// Check if user from token is the owner of queried lobby
// Check if user is already banned from lobby
// Remove user from lobby.users.bannedUsers
// Return success message and updated lobby
const unbanUser = ( req, res, done ) => {
  const tokenUserId = req.user._id;
  let userToUnban = null;
  const lobbyId = req.params.lobby_id;
  let mayUnbanUser = false;

  User.findById({ _id: req.params.user_id }).exec().then(user => {
    // Set userToUnban to this found user
    userToUnban = user;
  }).catch(err => done(`Couldn't unban that user because it doesn't exist!`));

  Lobby.findById({ _id: lobbyId }).exec().then(lobby => {

    // Check to see if user in token owns the lobby
    if (tokenUserId.toJSON() !== lobby.users.ownerId.toJSON()) {
      return done('You must own this lobby to unban a user.');
    }

    // Get index of the user to be unbanned from the lobby's banned users
    const bannedUserMap = lobby.users.bannedUsers.map(bannedUser => bannedUser._id.toJSON());
    const indexOfBannedUser = bannedUserMap.indexOf(userToUnban._id.toJSON());
    const userIsBanned = indexOfBannedUser >= 0;

    // Check to see if the user is in the lobby's users.bannedUsers array
    if (!userIsBanned) return done(`${userToUnban.userName} was not found in the banned users list of ${lobby.lobbyName}.`);

    // Remove user from bannedUsers array
    lobby.users.bannedUsers.splice(indexOfBannedUser, 1);

    // Now update the lobby
    Lobby.findOneAndUpdate({ _id: lobby._id }, lobby).exec().catch(err => done(`Cannot unban user because the lobby failed to update.`));

    // Respond with success message
    return res.json({ success: true, message: `${req.user.userName} unbanned ${userToUnban.userName} from ${lobby.lobbyName}.`, lobby });
  })
  .catch(err => done(`Couldn't unban that user because the lobby does not exist!`));

}

// Find lobby by id
// Add user details to song request body
// Check to see if user is owner or joined
// Check to see if the song URL isn't already queued
// Add song to old lobby playlist
// Update lobby with new playlist
// Return success message and updated lobby
const queueSong = ( req, res, done ) => {
  let user = req.user;
  let song = req.body;
  // Add user details to request body
  song.addedByUser._id = user._id;
  song.addedByUser.userName = user.userName;

  // Find lobby by id in the request URL parameters
  Lobby.findById({ _id: req.params.lobby_id }).exec().then(oldLobby => {

    // Check to see if user owns or is in the lobby
    const joinedUserMap = oldLobby.users.joined.map(user => user._id.toJSON());
    const isOwner = user._id.toJSON() === oldLobby.users.ownerId.toJSON();
    const isInLobby = joinedUserMap.indexOf(user._id.toJSON()) >= 0;
    const allowedToQueue = (isOwner || isInLobby);

    // If user isn't owner or in lobby, return false success message
    if (!allowedToQueue) return done('You must own or be in this lobby to queue a song.', false);

    // Make sure song URL isn't already in the queue
    const playlistUrls = oldLobby.playlist.map(song => {
      return song.songUrl;
    })
    const alreadyQueued = playlistUrls.indexOf(song.songUrl) >= 0;
    if (alreadyQueued) return done('This song is already in the queue!', false)

    // Add song to existing playlist
    oldLobby.playlist = [...oldLobby.playlist, song];

    // Update the lobby's playlist
    Lobby.findOneAndUpdate({ _id: req.params.lobby_id }, oldLobby).exec()
    .then(lobby => res.json({ success: true, message: `${user.userName} successfully added ${song.songTitle} to ${lobby.lobbyName}!`, lobby: oldLobby }))
    .catch((err) => done(err, false))

  }).catch((err) => done(err, false));
}

// Find lobby by id but if it doesn't exist,
// Remove the lobby from user.lobbiesJoined and return success message
// If the loby exists, you can only leave if you ARE NOT the owner
// If the user IS the owner of the lobby, return error message
// Remove user from lobby object
// Remove lobby from users object
// Return success message and updated user
const leaveLobby = ( req, res, done ) => {
  const lobbyId = req.params.lobby_id;
  const user = req.user;
  function removeLobbyFromUser(){
    // Check user.joinedLobbies for queried lobbyId
    User.findById({ _id: user._id }).exec().then(foundUser => {
      const lobbyIdMap = foundUser.lobbiesJoined.map(lobby => lobby._id.toJSON());
      const indexOfJoinedLobby = lobbyIdMap.indexOf(lobbyId);
      const userHasJoinedLobby = (indexOfJoinedLobby >= 0);
      const lobbyName = foundUser.lobbiesJoined[indexOfJoinedLobby].lobbyName;

      // If the user has this lobbyId in their joinedLobbies, remove it
      if (userHasJoinedLobby) {
        // Remove lobby from user.joinedLobbies
        foundUser.lobbiesJoined.splice(indexOfJoinedLobby, 1);
        // Update user
        User.findOneAndUpdate({ _id: user._id }, foundUser).exec().catch((err) => done('Cannot remove lobby from your lobbiesJoined array.', false));

        return res.json({success: true, message: `You have successfully left ${lobbyName}.`, user: foundUser});
      } else {
        // If the user doesn't have this lobbyId in ther joinedLobbies
        // Return error message
        return done(`You dont have this lobby saved in your joined lobbies.`)
      }
    }).catch((err) => done(`Cannot find user ${user.userName} in DB.`, false));
  }

  // Check to see if the lobby exists
  Lobby.findById({ _id: lobbyId }).exec().then(foundLobby => {
    // Lobby exists, continue on
    const joinedUserMap = foundLobby.users.joined.map(user => user._id.toJSON());
    const indexOfUser = joinedUserMap.indexOf(user._id.toJSON());
    const lobbyHasUserJoined = indexOfUser >= 0;
    const isLobbyOwner = user._id.toJSON() === foundLobby.users.ownerId.toJSON();

    // If the user is the lobbyOwner, return error message
    if (isLobbyOwner) return done(`You cannot leave the lobby you own, you must delete it.`)

    // If the user is in the lobby.users.joined, remove user
    // Update lobby
    if (lobbyHasUserJoined) {
      foundLobby.users.joined.splice(indexOfUser, 1);
      // Update lobby
      Lobby.findOneAndUpdate({ _id: lobbyId }, foundLobby).exec()
      .catch((err) => done(`Cannot remove user ${user.userName} from lobby ${foundLobby.lobbyName}.`, false));
    }
    // Remove the lobby object from user.lobbiesJoined
    removeLobbyFromUser();
  }).catch((err) => {
    // If the lobby doesn't exist
    // Remove lobby object from users.lobbiesJoined
    removeLobbyFromUser();
  });
}

const lobbyUserController = { joinLobby, banUser, unbanUser, queueSong, leaveLobby, deleteLobby, createLobby };

export default lobbyUserController;
