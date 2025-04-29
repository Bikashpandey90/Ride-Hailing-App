const router = require('express').Router();

const authRouter = require('../modules/auth/auth.router');
const bannerRouter = require('../modules/banners/banner.router');
const chatRouter = require('../modules/chat/chat.router');
const miscRouter = require('../modules/misc/misc.router');
const reviewRouter = require('../modules/review/review.router');
const rideRouter = require('../modules/ride/ride.router');



router.use('/auth', authRouter)
router.use('/banner', bannerRouter)
router.use('/chat', chatRouter)
router.use('/ride', rideRouter)
router.use('/review', reviewRouter)
router.use('/misc', miscRouter)



module.exports = router;