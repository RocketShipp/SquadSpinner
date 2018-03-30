import Passport from 'passport';
import '../../utils/authutils';
import userController from '../controllers/userController';
import lobbyController from '../controllers/lobbyController';
import lobbyUserController from '../controllers/lobbyUserController';

const signInStrategy = Passport.authenticate('signInStrategy', {
  session: false
});
const authStrategy = Passport.authenticate('authStrategy', {
  session: false,
  failureRedirect: '/'
});

export default (router) => {
  // User Routes
  router.post('/login', signInStrategy, userController.defaultLogin);
  router.post('/signup', userController.defaultSignup);
  router.post('/getUser', authStrategy, userController.getUser);
  router.put('/editUser', authStrategy, userController.defaultEditUser);

  // Lobby Routes
  router.post('/getLobby/:shortId', authStrategy, lobbyController.getLobby);
  router.put('/updateLobbySettings/:lobby_id', authStrategy, lobbyController.updateLobbySettings);
  router.post('/removeSong/:song_id/fromLobby/:lobby_id', authStrategy, lobbyController.removeSong);

  // Lobby User Routes
  router.post('/joinLobby/:shortId', authStrategy, lobbyUserController.joinLobby);
  router.post('/createLobby', authStrategy, lobbyUserController.createLobby);
  router.delete('/deleteLobby/:lobby_id', authStrategy, lobbyUserController.deleteLobby);
  router.post('/banUser/:user_id/fromLobby/:lobby_id', authStrategy, lobbyUserController.banUser);
  router.post('/unbanUser/:user_id/fromLobby/:lobby_id', authStrategy, lobbyUserController.unbanUser);
  router.put('/queueSong/:lobby_id', authStrategy, lobbyUserController.queueSong);
  router.post('/leaveLobby/:shortId', authStrategy, lobbyUserController.leaveLobby);
}
