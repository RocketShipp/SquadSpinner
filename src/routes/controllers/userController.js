import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

// Create a token
function tokenForUser(user) {
  return jwt.sign(user.toJSON(), process.env.SECRET);
}

// Store user object in a jwt token and return it
const defaultLogin = ( req, res ) => {
  return res.json({ token: tokenForUser(req.user) });
}

// Make sure all fields are filled and save user in DB
// If email already exists in DB, fail
// Save user in DB and return token
const defaultSignup = ( req, res, next ) => {
  const { email, userName, password } = req.body
  const newUser = new User({ email, userName, password })

  // Handle missing email or password
  if (!email || !userName || !password) return res.status(422).json({ error: 'Provide a username, email, and password!' })

  // Save new user and respond with token
  newUser.save().then((user) => {
    return res.json({ token: tokenForUser(user) })
  })
  .catch((err) => {
    // Duplicate email error
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).json({ error: `${newUser.email} is already in use!` })
    }
  })
}

// Return success mesasge and user object passed from authStrategy
const getUser = ( req, res ) => {
  return res.json({success: true, user: req.user});
}

// Find user by req params Id
// If the param id doesn't match your userId from token, return fail
// Update user in the DB
// Return success message and new token
const defaultEditUser = ( req, res, done ) => {
  const userId = req.params.user_id;
  const set = req.body;

  // Find user by given ID
  User.findById({ _id: userId }).exec().then(user => {
    // Edit user property of userName
    user.userName = set.userName || user.userName;
    // If userId from the token matches the userId in the params
    // Pass updated user to next promise
    return ( userId === user._id.toJSON() ) ?
    user :
    res.json({ success: false, message: "You must be the owner of this account to make changes!" });
  }).then(updatedUser => {
    // Update existing user in DB
    // Return success message and new token
    User.findOneAndUpdate({ _id: userId }, updatedUser).exec()
    .then(() => {
      return res.json({ success: true, message: `User ${updatedUser.userName} successfully updated at ${new Date()}.`, token: tokenForUser(updatedUser) });
    })
    .catch(err => done(`Error updating user ${user.userName}.`));
  })
}

// Unfinished...
const fbCallback = ( req, res ) => {
  console.log('Facebook user (change this later!!!)' + req.user);
  return res.json({ token: tokenForUser(req.user) });
}

const userController = { defaultLogin, defaultSignup, getUser, defaultEditUser, fbCallback };

export default userController;