const Joi = require("joi");

const reviewCreateDTO = Joi.object({

    // user: Joi.string().required(),
    rider: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(500).trim(),
    ride: Joi.string().required()

})

module.exports = {
    reviewCreateDTO
}