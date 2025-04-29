const { checkLogin, checkLoginRider } = require('../middlewares/auth.middleware')
const bodyValidator = require('../middlewares/bodyvalidator.middleware')
const { allowedRoles } = require('../middlewares/rbac.middleware')
const rideCtrl = require('./ride.controller')
const { RideRequestDTO, RideStartDTO, confirmRideDTO, fetchRecentRidesDTO, PaymentDTO } = require('./ride.validator')

const rideRouter = require('express').Router()

rideRouter.post('/request', checkLogin, bodyValidator(RideRequestDTO), rideCtrl.requestRide)
rideRouter.post('/rides', checkLoginRider, bodyValidator(fetchRecentRidesDTO), rideCtrl.getRides)
rideRouter.patch('/accept-ride', checkLoginRider, bodyValidator(confirmRideDTO), rideCtrl.confirmRide)
rideRouter.patch('/update-ride-status', checkLoginRider, bodyValidator(RideStartDTO), rideCtrl.updateRideStatus)
rideRouter.post('/payment/:id', checkLogin, allowedRoles(['admin','customer']), bodyValidator(PaymentDTO), rideCtrl.makePayment)
rideRouter.get('/recent-ride-locations',checkLogin, allowedRoles(['admin','customer']), rideCtrl.getRecentRideLocations)

rideRouter.route('/:id')
    .get(checkLogin, allowedRoles(['admin', 'customer']), rideCtrl.getRideDetail)
    .delete(checkLogin, allowedRoles(['admin']), rideCtrl.deleteRide)
    .patch(checkLogin, allowedRoles(['admin']), rideCtrl.updateRide)





module.exports = rideRouter