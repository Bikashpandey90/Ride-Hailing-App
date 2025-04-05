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
    status: Joi.string().valid("ongoing", "completed").required()
})
const confirmRideDTO = Joi.object({
    rideId: Joi.object().required()

})
const PaymentDTO = Joi.object({
    method: Joi.string().regex(/^(esewa|khalti|connectips|bank|cash|other)$/).default('cash'),
    amount: Joi.number().min(20).required(),
    transactionCode: Joi.string().allow(null, '').default(null),
    data: Joi.any()

})

module.exports = {
    RideRequestDTO,
    RideStartDTO,
    confirmRideDTO,
    fetchRecentRidesDTO,
    PaymentDTO
}