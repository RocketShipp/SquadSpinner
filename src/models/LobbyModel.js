import Mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import shortID from 'shortid';

const LobbySchema = new Schema ({
  shortId: { type: String, required: true, default: shortID.generate },
  lobbyName: { type: String, required: true },
  settings: {
    voteToSkip: {
      voteToSkipEnabled: { type: Boolean, required: true },
      requiredVotesToSkip: { type: Number, required: true }
    },
    hideVideoPlayer: { type: Boolean, required: true }
  },
	users: {
  	ownerId: { type: Schema.Types.ObjectId, required: true },
    joined:  [{
      _id: { type: Schema.Types.ObjectId, required: true },
      userName: { type: String, required: true}
    }],
    bannedUsers: [{
      _id: { type: Schema.Types.ObjectId, required: true },
      userName: { type: String, required: true}
    }]
  },
  playlist: [{
    songTitle: { type: String, required: true },
    songUrl: { type: String, required: true },
    provider: { type: String, required: true },
    addedByUser: {
      _id: { type: Schema.Types.ObjectId, required: true},
      userName: { type: String, required: true}
    }
  }],
  dateCreated: { type: Date, required: true, default: new Date() }
});

LobbySchema.pre('save', (next, err) => {
  if (err) return next(err);
  return next(this);
})

export default Mongoose.model('Lobby', LobbySchema);
