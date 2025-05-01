const Joi = require("joi");
const geoJSONPointSchema = Joi.object({
    type: Joi.string().default('Point').valid('Point').optional(),
    coordinates: Joi.array()
        .items(
            Joi.number().required(), // longitude
            Joi.number().required()  // latitude
        )
        .length(2)
        .required()
    , name: Joi.string().default("").required()
});

const RideRequestDTO = Joi.object({

    // pickUpLocation: Joi.object({
    //     latitude: Joi.number().required(),
    //     longitude: Joi.number().required()
    // }).required(),
    pickUpLocation: geoJSONPointSchema.required(),
    dropOffLocation: geoJSONPointSchema.required(),


    // dropOffLocation: Joi.object({
    //     latitude: Joi.number().required(),
    //     longitude: Joi.number().required()
    // }).required(),
    vehicleType: Joi.string().default('bike').required()
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
    rideId: Joi.string().required()

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