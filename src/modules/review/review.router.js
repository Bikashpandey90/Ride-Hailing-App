const { checkLogin } = require('../middlewares/auth.middleware')
const { allowedRoles } = require('../middlewares/rbac.middleware')
const reviewCtrl = require('./review.controller')

const reviewRouter = require('express').Router()

reviewRouter.post('/create-review', checkLogin, allowedRoles(['admin', 'customer']), reviewCtrl.createReview)
reviewRouter.get('/rider-reviews', reviewCtrl.getRiderReviews)

reviewRouter.route(':/id')
    .get(checkLogin, allowedRoles(['admin', 'customer']), reviewCtrl.detail)
    .delete(checkLogin, allowedRoles(['admin', 'customer']), reviewCtrl.delete)
    .patch(checkLogin, allowedRoles(['admin', 'customer']), reviewCtrl.update)




module.exports = reviewRouter