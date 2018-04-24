'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _UserModel = require('../../models/UserModel');

var _UserModel2 = _interopRequireDefault(_UserModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a token
function tokenForUser(user) {
  return _jsonwebtoken2.default.sign(user.toJSON(), process.env.SECRET);
}

// Store user object in a jwt token and return it
var defaultLogin = function defaultLogin(req, res) {
  return res.json({ success: true, token: tokenForUser(req.user) });
};

// Make sure all fields are filled and save user in DB
// If email already exists in DB, fail
// Save user in DB and return token
var defaultSignup = function defaultSignup(req, res, done) {
  var _req$body = req.body,
      email = _req$body.email,
      userName = _req$body.userName,
      password = _req$body.password;

  var lowerCaseEmail = email.toLowerCase();
  email = lowerCaseEmail;
  var newUser = new _UserModel2.default({ email: email, userName: userName, password: password });

  // Handle missing email, username or password
  if (!email || !userName || !password) return done('Provide a username, email, and password!');

  // Save new user, respond with success and token
  newUser.save().then(function (user) {
    return res.json({ success: true, token: tokenForUser(user) });
  }).catch(function (err) {
    // Duplicate email error
    if (err.name === 'MongoError' && err.code === 11000) {
      return done(newUser.userName + ' or ' + newUser.email + ' has been taken!');
    }
  });
};

// Return success message and user object passed from authStrategy
var getUser = function getUser(req, res, err) {
  return res.json({ success: true, user: req.user });
};

// Find user by req params Id
// If the param id doesn't match your userId from token, return fail
// Update user in the DB
// Return success message and new token
var defaultEditUser = function defaultEditUser(req, res, done) {
  var userId = req.user._id.toJSON();
  var userName = req.user.userName;

  // Find user by given ID
  _UserModel2.default.findById({ _id: userId }).exec().then(function (user) {
    // Edit user property of userName
    user.userName = req.body.userName || user.userName;
    // If userId from the token matches the userId in the params
    // Pass updated user to next promise
    return userId === user._id.toJSON() ? user : done("You must be the owner of this account to make changes!");
  }).then(function (updatedUser) {
    // Update existing user in DB
    // Return success message and new token
    _UserModel2.default.findOneAndUpdate({ _id: userId }, updatedUser).exec().then(function () {
      console.log('User ' + updatedUser.userName + ' successfully updated at ' + new Date() + '.');
      return res.json({ success: true, token: tokenForUser(updatedUser), message: 'You are now ' + updatedUser.userName });
    }).catch(function (err) {
      return done('Error updating user ' + user.userName + '.');
    });
  });
};

var userController = { defaultLogin: defaultLogin, defaultSignup: defaultSignup, getUser: getUser, defaultEditUser: defaultEditUser };

exports.default = userController;