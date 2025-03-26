const { checkLogin } = require('../middlewares/auth.middleware')
const bodyValidator = require('../middlewares/bodyvalidator.middleware')
const rideCtrl = require('./ride.controller')
const { RideRequestDTO } = require('./ride.validator')

const rideRouter = require('express').Router()

rideRouter.post('/request', checkLogin, bodyValidator(RideRequestDTO), rideCtrl.requestRide)



module.exports = rideRouter