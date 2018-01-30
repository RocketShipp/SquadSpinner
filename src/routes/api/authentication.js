import Passport from 'passport';
import 'passport-facebook';
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
const facebookStrategy = Passport.authenticate('facebookStrategy', { authType: 'rerequest', scope: ['email', 'name', 'id'] });
const facebookCallback = Passport.authenticate('facebookStrategy', {
  failureRedirect: '/'
})

export default (router) => {
  // User Routes
  router.post('/login', signInStrategy, userController.defaultLogin);
  router.post('/signup', userController.defaultSignup);
  router.get('/getUser', authStrategy, userController.getUser);
  router.put('/editUser/:user_id', authStrategy, userController.defaultEditUser);

  // Lobby Routes
  router.get('/getLobby/:lobby_shortId', authStrategy, lobbyController.getLobby);
  router.put('/updateLobbySettings/:lobby_id', authStrategy, lobbyController.updateLobbySettings);
  router.get('/removeSong/:song_id/fromLobby/:lobby_id', authStrategy, lobbyController.removeSong);

  // Lobby User Routes
  router.get('/joinLobby/:lobby_id', authStrategy, lobbyUserController.joinLobby);
  router.post('/createLobby', authStrategy, lobbyUserController.createLobby);
  router.delete('/deleteLobby/:lobby_id', authStrategy, lobbyUserController.deleteLobby);
  router.get('/banUser/:user_id/fromLobby/:lobby_id', authStrategy, lobbyUserController.banUser);  router.get('/unbanUser/:user_id/fromLobby/:lobby_id', authStrategy, lobbyUserController.unbanUser);
  router.put('/queueSong/:lobby_id', authStrategy, lobbyUserController.queueSong);
  router.get('/leaveLobby/:lobby_id', authStrategy, lobbyUserController.leaveLobby);

  // Facebook Routes
  router.get('/auth/facebook', facebookStrategy);
  router.get('/auth/facebook/callback', facebookCallback, userController.fbCallback);
}
