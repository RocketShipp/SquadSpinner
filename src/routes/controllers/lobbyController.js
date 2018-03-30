import jwt from 'jsonwebtoken';
import Lobby from '../../models/LobbyModel';

// With given 'lobbyId' request params, return lobby from DB
const getLobby = ( req, res, done ) => {
  Lobby.findOne({ shortId: req.params.shortId }).exec().then(( lobby ) => {
    if ( lobby === null ) {
      return done(`This lobby doesn't exist or has been deleted.`);
    } else {
      return res.json( lobby );
    }
  }).catch(err => done(`This lobby doesn't exist or has been deleted.`));
}

// Query lobbies in DB with given lobby_id in URL params
// Fill request body with new information or leave old info
// If user is the owner of the lobby, update the lobby in the DB
// Returns success message and updated lobby
const updateLobbySettings = ( req, res, done ) => {
  const user = req.user.id;
  const set = req.body;

  // Find lobby by given ID
  Lobby.findById({ _id: req.params.lobby_id }).exec().then(lobby => {
    // Create a new lobby with information in request body
    const updatedLobby = {
      _id: lobby._id,
      lobbyName: set.lobbyName || lobby.lobbyName,
      settings: {
        voteToSkip: {
          voteToSkipEnabled: set.settings.voteToSkip.voteToSkipEnabled || lobby.settings.voteToSkip.voteToSkipEnabled,
          requiredVotesToSkip: set.settings.voteToSkip.requiredVotesToSkip || lobby.settings.voteToSkip.requiredVotesToSkip
        },
        hideVideoPlayer: set.settings.hideVideoPlayer || lobby.settings.hideVideoPlayer
      }
    }

    const isOwner = req.user.id === lobby.users.ownerId.toJSON();
    return ( isOwner ) ? updatedLobby :
    done(`You must be the owner of this lobby to make changes.`, false);
  }).then(updatedLobby => {
    // Update existing lobby in DB with updated lobby
    Lobby.findOneAndUpdate({ _id: updatedLobby._id }, updatedLobby).exec()
    .then(() => res.json({ success: true, message: `Lobby ${updatedLobby.lobbyName} successfully updated at ${new Date()}.`, lobby: updatedLobby }))
    .catch(err => done(`Error updating lobby ${lobby.lobbyName}.`));
  })
}

// Find lobby by lobby_id given in URL params
// Check to see if the request is coming from the lobby owner
// Remove the song from lobby.playlist array with id given in URL params
// Update lobby
// Return success message and updated lobby
const removeSong = ( req, res, done ) => {
  const user = req.user;
  const lobbyId = req.params.lobby_id;
  const songId = req.params.song_id;

  Lobby.findById({ _id: lobbyId }).exec().then(foundLobby => {
    // If the user from token is not the owner of the found lobby,
    // Return error message
    if (user._id.toJSON() !== foundLobby.users.ownerId.toJSON()) {
      return done('You must own this lobby to remove a song!');
    }
    const playlistIdMap = foundLobby.playlist.map(song => song._id.toJSON());
    const indexOfSong = playlistIdMap.indexOf(songId);
    const songExistsInPlaylist = indexOfSong >= 0;

    if (songExistsInPlaylist) {
      // Remove song from playlist
      foundLobby.playlist.splice(indexOfSong, 1);
      // Update lobby
      Lobby.findOneAndUpdate({ _id: lobbyId }, foundLobby).exec()
      .catch((err) => done(`Could not remove ${songTitle} from ${foundLobby.lobbyName}.`));

      return res.json({success: true, message: `Successfully removed song from ${foundLobby.lobbyName}`, lobby: foundLobby});
    } else {
      return res.json({message: `Your playlist does not contain this song, or it has already been removed.`});
    }
  }).catch((err) => done('Cannot remove song because the lobby was not found.'));

}

const lobbyController = { getLobby, updateLobbySettings, removeSong };

export default lobbyController;
