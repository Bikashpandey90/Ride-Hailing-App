const router = require('express').Router();

const authRouter = require('../modules/auth/auth.router');
const bannerRouter = require('../modules/banners/banner.router');
const chatRouter = require('../modules/chat/chat.router');
const rideRouter = require('../modules/ride/ride.router');



router.use('/auth', authRouter)
router.use('/banner', bannerRouter)
router.use('/chat', chatRouter)
router.use('/ride', rideRouter)



module.exports = router;