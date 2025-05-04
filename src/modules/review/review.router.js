const { checkLogin } = require('../middlewares/auth.middleware')
const bodyValidator = require('../middlewares/bodyvalidator.middleware')
const { allowedRoles } = require('../middlewares/rbac.middleware')
const reviewCtrl = require('./review.controller')
const { reviewCreateDTO } = require('./review.validator')

const reviewRouter = require('express').Router()

reviewRouter.post('/create-review', checkLogin, allowedRoles(['admin', 'customer']), bodyValidator(reviewCreateDTO), reviewCtrl.createReview)
reviewRouter.get('/rider-reviews/:id', reviewCtrl.getRiderReviews)
reviewRouter.get('/user-reviews', checkLogin, reviewCtrl.getUserReviews)
reviewRouter.route('/:id')
    .get(checkLogin, allowedRoles(['admin', 'customer']), reviewCtrl.detail)
    .delete(checkLogin, allowedRoles(['admin', 'customer']), reviewCtrl.delete)
    .patch(checkLogin, allowedRoles(['admin', 'customer']), reviewCtrl.update)




module.exports = reviewRouter