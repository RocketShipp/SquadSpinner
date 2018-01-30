import Passport from 'passport';
import LocalStrategy from 'passport-local';
import passportJwt, { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/UserModel';
import bcrypt from 'bcrypt';
import PassportFB, { Strategy as FacebookStrategy } from 'passport-facebook'
require('dotenv').config();

// Passport-Local log-in strategy
const signInStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
(email, password, done) => {
  User.findOne({ email }).exec().then( user => {
    // If there is no user, return done()
    if (!user) return done(null, false);
    // If there is a user, compare passwords with bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return done(err, false);
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

// Facebook Strategy gets user from facebook
const facebookStrategy = new FacebookStrategy({
  clientID: 1931096037151299,
  clientSecret: '05a1aec7bc77795a45e6ea7c9a2b8de3',
  callbackURL: "http://localhost:3000/api/auth/facebook/callback",
  profileFields: ['id', 'email', 'name']
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    // Looks for FB user in DB
    User.findOne({facebookID: profile.id}, (err, user) => {
      // Handle errors
      if (err) { return done(err, false) }
      // If user is in DB, return user
      if (user) { return done(null, user) }
      // Save user if it is not in DB already and return user
      const newUser = new User({
        facebookEmail: profile.emails[0].value,
        facebookID: profile.id,
        password: accessToken
      })
      newUser.save((err) ? done(`Error saving Facebook user.`) : done(null, newUser));
    })
})

Passport.use('signInStrategy', signInStrategy);
Passport.use('authStrategy', authStrategy);
Passport.use('facebookStrategy', facebookStrategy);
