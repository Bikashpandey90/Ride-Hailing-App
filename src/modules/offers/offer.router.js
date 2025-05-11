const { checkLogin } = require('../middlewares/auth.middleware')
const { allowedRoles } = require('../middlewares/rbac.middleware')
const offerCtrl = require('./offer.controller')

const offerRouter = require('express').Router()

//// todo : add validator for offer code and description


offerRouter.post('/create', checkLogin, allowedRoles(['admin']), offerCtrl.createOffer)
offerRouter.post('/check', checkLogin, allowedRoles(['admin', 'customer']), offerCtrl.checkOfferCodeUniqueness)
offerRouter.post('/get-offer', checkLogin, allowedRoles(['admin', 'customer']), offerCtrl.getOffer)
offerRouter.get('/list-all-offers', checkLogin, allowedRoles(['admin']), offerCtrl.getAllOffers)
offerRouter.patch('/update-offer', checkLogin, allowedRoles(['admin']), offerCtrl.updateOffer)
offerRouter.delete('/delete-offer', checkLogin, allowedRoles(['admin']), offerCtrl.deleteOffer)




module.exports = offerRouter