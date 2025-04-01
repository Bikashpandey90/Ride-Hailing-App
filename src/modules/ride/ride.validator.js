const Joi = require("joi");

const RideRequestDTO = Joi.object({
    userId: Joi.string().required(),

    pickUpLocation: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }).required(),
    dropOffLocation: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }).required(),
    vehicleType: Joi.string().required()
});

const fetchRecentRidesDTO = Joi.object({
    location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }).required()

})

const RideStartDTO = Joi.object({
    rideId: Joi.string().required(),
    status: "ongoing"

})
const confirmRideDTO = Joi.object({
    rideId: Joi.object().required()

})

module.exports = {
    RideRequestDTO,
    RideStartDTO,
    confirmRideDTO,
    fetchRecentRidesDTO
}