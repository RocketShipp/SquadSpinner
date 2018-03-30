import Mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = parseInt(process.env.SALTROUNDS);

const UserSchema = new Mongoose.Schema ({
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: false },
  password: { type: String, required: true },
  lobbiesJoined: [
    {
      _id: { type: Schema.Types.ObjectId, required: true },
      shortId: { type: String, required: true },
      lobbyName: { type: String, required: true }
    }
  ],
  lobbiesOwned: [
    {
      _id: { type: Schema.Types.ObjectId, required: true },
      shortId: { type: String, required: true },
      lobbyName: { type: String, required: true }
    }
  ],
  dateCreated: {type: Date, required: true, default: new Date()}
})

UserSchema.pre( 'save' , function (next, err) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, saltRounds, ( err, hash ) => {
    // Store hashed password in MongoDB
    if (err) return next(err);
    user.password = hash;
    return next(user);
  })
})

export default Mongoose.model('User', UserSchema);
