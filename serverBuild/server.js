'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _api = require('./routes/api/api.js');

var _api2 = _interopRequireDefault(_api);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var app = (0, _express2.default)();
var server = require('http').Server(app);
var io = require('socket.io')(server);

_mongoose2.default.Promise = global.Promise;

app.enable('trust proxy');

_mongoose2.default.connect(process.env.MONGODB_URI, { useMongoClient: true }).then(function () {
  return console.log('[mongoose] Connected to MongoDB');
}).catch(function () {
  return console.log('[mongoose] Error connecting to MongoDB... Did you run mongod?');
});

app.use(_express2.default.static('./dist'));

app.get('*', function (req, res) {
  return res.sendFile(_path2.default.resolve('./dist'));
});

// use body parser so we can get info from POST and/or URL parameters
app.use(_bodyParser2.default.json());

(0, _api2.default)(app);

// Handle socket events
io.on('connection', function (socket) {

  var shortId = socket.handshake['query']['shortId'];

  socket.join(shortId);

  socket.on('disconnect', function () {
    socket.leave(shortId);
  });

  socket.on('update_playlist', function (playlist) {
    io.to(shortId).emit('update_playlist', playlist);
  });

  socket.on('update_playing', function (playing) {
    io.to(shortId).emit('update_playing', playing);
  });
});

server.listen(process.env.PORT || 80);