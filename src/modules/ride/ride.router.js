const { checkLogin, checkLoginRider } = require('../middlewares/auth.middleware')
const bodyValidator = require('../middlewares/bodyvalidator.middleware')
const { allowedRoles } = require('../middlewares/rbac.middleware')
const rideCtrl = require('./ride.controller')
const { RideRequestDTO, RideStartDTO, confirmRideDTO, fetchRecentRidesDTO, PaymentDTO } = require('./ride.validator')

const rideRouter = require('express').Router()

rideRouter.post('/request', checkLogin, bodyValidator(RideRequestDTO), rideCtrl.requestRide)
rideRouter.post('/rides', checkLoginRider, bodyValidator(fetchRecentRidesDTO), rideCtrl.getRides)
rideRouter.patch('/accept-ride', checkLoginRider, bodyValidator(confirmRideDTO), rideCtrl.confirmRide)
rideRouter.patch('/update-ride-status', checkLoginRider, bodyValidator(RideStartDTO), rideCtrl.updateRide)
//rideRouter.post('/:id/payment', checkLogin, allowedRoles['admin', 'customer'], bodyValidator(PaymentDTO), rideCtrl.makePayment)




module.exports = rideRouter