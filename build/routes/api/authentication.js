'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _userController = require('../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

var _lobbyController = require('../controllers/lobbyController');

var _lobbyController2 = _interopRequireDefault(_lobbyController);

var _lobbyUserController = require('../controllers/lobbyUserController');

var _lobbyUserController2 = _interopRequireDefault(_lobbyUserController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('../../utils/authUtils');

var signInStrategy = _passport2.default.authenticate('signInStrategy', {
  session: false
});
var authStrategy = _passport2.default.authenticate('authStrategy', {
  session: false,
  failureRedirect: '/'
});

exports.default = function (router) {
  // User Routes
  router.post('/login', signInStrategy, _userController2.default.defaultLogin);
  router.post('/signup', _userController2.default.defaultSignup);
  router.post('/getUser', authStrategy, _userController2.default.getUser);
  router.put('/editUser', authStrategy, _userController2.default.defaultEditUser);

  // Lobby Routes
  router.post('/getLobby/:shortId', authStrategy, _lobbyController2.default.getLobby);
  router.put('/updateLobbySettings/:shortId', authStrategy, _lobbyController2.default.updateLobbySettings);
  router.put('/updateLobbyPlaylist/:shortId', authStrategy, _lobbyController2.default.updateLobbyPlaylist);
  router.put('/removeSong/:song_id/fromSquad/:shortId', authStrategy, _lobbyController2.default.removeSong);

  // Lobby User Routes
  router.post('/joinLobby/:shortId', authStrategy, _lobbyUserController2.default.joinLobby);
  router.post('/createLobby', authStrategy, _lobbyUserController2.default.createLobby);
  router.delete('/deleteLobby/:lobby_id', authStrategy, _lobbyUserController2.default.deleteLobby);
  router.post('/banUser/:user_id/fromLobby/:lobby_id', authStrategy, _lobbyUserController2.default.banUser);
  router.post('/unbanUser/:user_id/fromLobby/:lobby_id', authStrategy, _lobbyUserController2.default.unbanUser);
  router.put('/queueSong/:shortId', authStrategy, _lobbyUserController2.default.queueSong);
  router.post('/leaveLobby/:shortId', authStrategy, _lobbyUserController2.default.leaveLobby);
};