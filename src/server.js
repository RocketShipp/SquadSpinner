import express from 'express';
import path from 'path';
import Mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Api from './routes/api/api.js';
import Passport from 'passport';
require('dotenv').config();

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

Mongoose.Promise = global.Promise;

app.enable( 'trust proxy' );

Mongoose.connect(process.env.MONGOURI, { useMongoClient: true })
  .then(() => console.log('[mongoose] Connected to MongoDB'))
  .catch(() => console.log('[mongoose] Error connecting to MongoDB... Did you run mongod?'));

app.use( express.static('./dist') );

app.get('/', ( req, res ) => {
  res.sendFile( path.resolve('index.html') );
});

// use body parser so we can get info from POST and/or URL parameters
app.use( bodyParser.json() );

Api(app);

server.listen(process.env.PORT);

// Handle socket connections
io.on('connection', (socket) => {
  console.log('[Socket.io] Connected to socket');
})
