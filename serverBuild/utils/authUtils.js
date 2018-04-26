'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _UserModel = require('../models/UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

// Passport-Local log-in strategy
var signInStrategy = new _passportLocal2.default({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  _UserModel2.default.findOne({ email: email.toLowerCase() }).exec().then(function (user) {

    // If there is no user, return done()
    if (!user) return done(email + ' not found in records');

    // If there is a user, compare passwords with bcrypt
    _bcrypt2.default.compare(password, user.password, function (err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done('Incorrect Password!');
      console.log('User \'' + user.email + '\' logged in on ' + new Date() + '!');
      // Return user object upon success
      return done(null, user);
    });
  }).catch(function (err) {
    return done('Error finding user by email address ' + email + '.');
  });
});

// Options for the authStrategy to decode tokens
var jwtOptions = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: _passportJwt.ExtractJwt.fromHeader('authorization'),
  ignoreExpiration: true

  // Decodes token in request header
  // Looks for user in the database using decoded userID
  // Returns user from MongoDB
};var authStrategy = new _passportJwt.Strategy(jwtOptions, function (payload, next, err) {
  var userId = payload._id;
  _UserModel2.default.findById({ _id: payload._id }).exec().then(function (user) {
    return next(null, user);
  }).catch(function (err) {
    return next(err, false);
  });
});

_passport2.default.use('signInStrategy', signInStrategy);
_passport2.default.use('authStrategy', authStrategy);