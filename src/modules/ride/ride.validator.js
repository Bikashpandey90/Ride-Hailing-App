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

module.exports = {
    RideRequestDTO
}