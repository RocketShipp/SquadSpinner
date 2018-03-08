import Express from 'express'
import RateLimit from 'express-rate-limit';
import Authentication from './authentication';

const apiLimiter = new RateLimit({
  windowMs: 1000, // 1 Second
  max: 3,
  delayMs: 0, //disabled
  message: 'Too many requests have been made!',
  handler: (req, res) => {
    res.status(429).json({ success: false, message: 'Too many requests have been made!' })
  }
})

const apiErrorHandler = (error, req, res, next) => {
  if (error) {
    return res.json({success: false, message: error});
  }
  return res.status(404).json({message: 'Sorry, there is nothing at this endpoint.'});
}

export default (router) => {
  const apiRouter = Express.Router();
  apiRouter.use(apiLimiter);
  Authentication(apiRouter);
  router.use('/api', apiRouter);
  // If the requests make it past this endpoint, this implies an error must've
  // happened that isn't handled there. These will catch them.
  router.use('/api', apiErrorHandler);
}
