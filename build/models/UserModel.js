'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = parseInt(process.env.SALTROUNDS);

var UserSchema = new _mongoose2.default.Schema({
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  lobbiesJoined: [{
    _id: { type: _mongoose.Schema.Types.ObjectId, required: true },
    shortId: { type: String, required: true },
    lobbyName: { type: String, required: true }
  }],
  lobbiesOwned: [{
    _id: { type: _mongoose.Schema.Types.ObjectId, required: true },
    shortId: { type: String, required: true },
    lobbyName: { type: String, required: true }
  }],
  dateCreated: { type: Date, required: true, default: new Date() }
});

UserSchema.pre('save', function (next, err) {
  var user = this;
  if (!user.isModified('password')) return next();
  _bcrypt2.default.hash(user.password, saltRounds, function (err, hash) {
    // Store hashed password in MongoDB
    if (err) return next(err);
    user.password = hash;
    return next(user);
  });
});

exports.default = _mongoose2.default.model('User', UserSchema);