import jwt from 'jsonwebtoken';
import Lobby from '../../models/LobbyModel';

// With given 'lobbyId' request params, return lobby from DB
const getLobby = ( req, res, done ) => {
  Lobby.findOne({ shortId: req.params.shortId }).exec().then(( lobby ) => {
    if ( lobby === null ) {
      return done(`This lobby doesn't exist or has been deleted.`);
    } else {
      return res.json( {success: true, lobby} );
    }
  }).catch(err => done(`This lobby doesn't exist or has been deleted.`));
}

// Query lobbies in DB with given lobby_id in URL params
// Fill request body with new information or leave old info
// If user is the owner of the lobby, update the lobby in the DB
// Returns success message and updated lobby
const updateLobbySettings = ( req, res, done ) => {
  const user = req.user._id;
  const set = req.body;
  const shortId = req.params.shortId;
  let updatedSettings = {};

  // Find lobby by given ID
  Lobby.findOne({ shortId }).exec().then(lobby => {
    String(lobby.users.ownerId) !== String(user) ? done('You must own this lobby to edit settings.') : null;
    // Make sure all required request fields were provided
    if (
        set.hideVideoPlayer == undefined ||
        set.voteToSkip.voteToSkipEnabled == undefined ||
        set.voteToSkip.requiredVotesToSkip == undefined
      ) {
      return done('Each lobby setting must be provided -- refer to API guide.');
    } else {
      // Replace any lobby settings with provided settings from request
      set.hideVideoPlayer !== undefined ? (lobby.settings.hideVideoPlayer = set.hideVideoPlayer) : null;
      set.voteToSkip.voteToSkipEnabled !== undefined ? (lobby.settings.voteToSkip.voteToSkipEnabled = set.voteToSkip.voteToSkipEnabled) : null;
      set.voteToSkip.requiredVotesToSkip ? (lobby.settings.voteToSkip.requiredVotesToSkip = set.voteToSkip.requiredVotesToSkip) : null;

      // Update the lobby settings
      Lobby.findOneAndUpdate({ shortId }, lobby).then( oldLobby => {
        // Return updated lobby
        res.json({ success: true, lobby: lobby })
      }).catch(err => done('Error updating lobby settings.'))
    }
  }).catch(err => done('Could not find lobby.'));
}

const updateLobbyPlaylist = (req, res, done) => {
  const user = req.user._id;
  const set = req.body;
  const shortId = req.params.shortId;

  Lobby.findOne({ shortId }).exec().then(lobby => {
    // Check if user owns the lobby
    String(lobby.users.ownerId) !== String(user) ? done('You must own this lobby to edit playlist.') : null;
    lobby.playlist = set.playlist;
    // Update lobby and return success message and lobby object
    Lobby.findOneAndUpdate({ shortId }, lobby).then(oldLobby => {
      return res.json({ success: true, lobby, message: 'Playlist updated.' })
    }).catch(err => done('Error updating playlist.'))
  }).catch(err => done('Error finding lobby.'))
}

// Find lobby by lobby_id given in URL params
// Check to see if the request is coming from the lobby owner
// Remove the song from lobby.playlist array with id given in URL params
// Update lobby
// Return success message and updated lobby
const removeSong = ( req, res, done ) => {
  const user = req.user;
  const lobbyId = req.params.shortId;
  const songId = req.params.song_id;

  Lobby.findOne({ shortId: lobbyId }).exec().then(foundLobby => {
    // If the user from token is not the owner of the found lobby,
    // Return error message
    if (user._id.toJSON() !== foundLobby.users.ownerId.toJSON()) {
      return done('You must own this lobby to remove a song!');
    }
    const playlistIdMap = foundLobby.playlist.map(song => song._id.toJSON());
    const indexOfSong = playlistIdMap.indexOf(songId);
    const songExistsInPlaylist = indexOfSong >= 0;
    const songTitle = foundLobby.playlist[indexOfSong].songTitle;

    if (songExistsInPlaylist) {
      // Remove song from playlist
      foundLobby.playlist.splice(indexOfSong, 1);
      // Update lobby
      Lobby.findOneAndUpdate({ shortId: lobbyId }, foundLobby).exec()
      .catch((err) => done(`Could not remove ${songTitle} from ${foundLobby.lobbyName}.`));

      return res.json({success: true, message: `${songTitle} removed.`, lobby: foundLobby});
    } else {
      return res.json({message: `Your playlist does not contain this song, or it has already been removed.`});
    }
  }).catch((err) => done('Cannot remove song because the lobby was not found.'));

}

const lobbyController = { getLobby, updateLobbySettings, removeSong, updateLobbyPlaylist };

export default lobbyController;
