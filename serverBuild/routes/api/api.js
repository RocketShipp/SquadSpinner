'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressRateLimit = require('express-rate-limit');

var _expressRateLimit2 = _interopRequireDefault(_expressRateLimit);

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiLimiter = new _expressRateLimit2.default({
  windowMs: 1000, // 1 Second
  max: 5,
  delayMs: 0, //disabled
  message: 'Too many requests have been made!',
  handler: function handler(req, res) {
    res.status(429).json({ success: false, message: 'Too many requests have been made!' });
  }
});

var apiErrorHandler = function apiErrorHandler(error, req, res, next) {
  if (error) {
    return res.json({ success: false, message: error });
  }
  return res.status(404).json({ message: 'Sorry, there is nothing at this endpoint.' });
};

exports.default = function (router) {
  var apiRouter = _express2.default.Router();
  apiRouter.use(apiLimiter);
  (0, _authentication2.default)(apiRouter);
  router.use('/api', apiRouter);
  // If the requests make it past this endpoint, this implies an error must've
  // happened that isn't handled there. These will catch them.
  router.use('/api', apiErrorHandler);
};