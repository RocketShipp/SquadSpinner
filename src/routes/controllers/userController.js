import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

// Create a token
function tokenForUser(user) {
  return jwt.sign(user.toJSON(), process.env.SECRET);
}

// Store user object in a jwt token and return it
const defaultLogin = ( req, res ) => {
  return res.json({ success: true, token: tokenForUser(req.user) });
}

// Make sure all fields are filled and save user in DB
// If email already exists in DB, fail
// Save user in DB and return token
const defaultSignup = ( req, res, done ) => {
  let { email, userName, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  email = lowerCaseEmail;
  const newUser = new User({ email, userName, password });

  // Handle missing email, username or password
  if (!email || !userName || !password) return done('Provide a username, email, and password!');

  // Save new user, respond with success and token
  newUser.save().then((user) => {
    return res.json({success: true, token: tokenForUser(user) })
  })
  .catch((err) => {
    // Duplicate email error
    if (err.name === 'MongoError' && err.code === 11000) {
      return done(`${newUser.userName} or ${newUser.email} has been taken!`);
    }
  })
}

// Return success message and user object passed from authStrategy
const getUser = ( req, res, err ) => {
  return res.json({success: true, user: req.user});
}

// Find user by req params Id
// If the param id doesn't match your userId from token, return fail
// Update user in the DB
// Return success message and new token
const defaultEditUser = ( req, res, done ) => {
  const userId = req.user._id.toJSON();
  const userName = req.user.userName;

  // Find user by given ID
  User.findById({ _id: userId }).exec().then(user => {
    // Edit user property of userName
    user.userName = req.body.userName || user.userName;
    // If userId from the token matches the userId in the params
    // Pass updated user to next promise
    return ( userId === user._id.toJSON() ) ? user :
    done("You must be the owner of this account to make changes!");
  }).then(updatedUser => {
    // Update existing user in DB
    // Return success message and new token
    User.findOneAndUpdate({ _id: userId }, updatedUser).exec()
    .then(() => {
      console.log(`User ${updatedUser.userName} successfully updated at ${new Date()}.`);
      return res.json({ success: true, token: tokenForUser(updatedUser), message: `You are now ${updatedUser.userName}` });
    })
    .catch(err => done(`Error updating user ${user.userName}.`));
  })
}

const userController = { defaultLogin, defaultSignup, getUser, defaultEditUser };

export default userController;
