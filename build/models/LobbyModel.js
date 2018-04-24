'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LobbySchema = new _mongoose.Schema({
  shortId: { type: String, required: true, default: _shortid2.default.generate },
  lobbyName: { type: String, required: true },
  settings: {
    voteToSkip: {
      voteToSkipEnabled: { type: Boolean, required: true },
      requiredVotesToSkip: { type: Number, required: true }
    },
    hideVideoPlayer: { type: Boolean, required: true }
  },
  users: {
    ownerId: { type: _mongoose.Schema.Types.ObjectId, required: true },
    joined: [{
      _id: { type: _mongoose.Schema.Types.ObjectId, required: true },
      userName: { type: String, required: true }
    }],
    bannedUsers: [{
      _id: { type: _mongoose.Schema.Types.ObjectId, required: true },
      userName: { type: String, required: true }
    }]
  },
  playlist: [{
    songTitle: { type: String, required: true },
    songUrl: { type: String, required: true },
    addedByUser: {
      _id: { type: _mongoose.Schema.Types.ObjectId, required: true },
      userName: { type: String, required: true }
    }
  }],
  dateCreated: { type: Date, required: true, default: new Date() }
});

LobbySchema.pre('save', function (next, err) {
  if (err) return next(err);
  return next(undefined);
});

exports.default = _mongoose2.default.model('Lobby', LobbySchema);