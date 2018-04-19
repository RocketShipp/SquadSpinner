import Passport from 'passport';
import LocalStrategy from 'passport-local';
import passportJwt, { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/UserModel';
import bcrypt from 'bcrypt';
require('dotenv').config();

// Passport-Local log-in strategy
const signInStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
(email, password, done) => {
  User.findOne({ email: email.toLowerCase() }).exec().then( user => {

    // If there is no user, return done()
    if (!user) return done(`${email} not found in records`);

    // If there is a user, compare passwords with bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) return done('Incorrect Password!');
      console.log(`User '${user.email}' logged in on ${new Date()}!`);
      // Return user object upon success
      return done(null, user);
    })
  })
  .catch((err) => done(`Error finding user by email address ${email}.`));
});

// Options for the authStrategy to decode tokens
const jwtOptions = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  ignoreExpiration: true
}

// Decodes token in request header
// Looks for user in the database using decoded userID
// Returns user from MongoDB
const authStrategy = new JwtStrategy(jwtOptions, (payload, next, err) => {
  const userId = payload._id;
  User.findById({ _id: payload._id }).exec().then(user => {
    return next(null, user);
  }).catch((err) => next(err, false));
});

Passport.use('signInStrategy', signInStrategy);
Passport.use('authStrategy', authStrategy);
