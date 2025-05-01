const Joi = require('joi');

const registerDataDTO = Joi.object({

    name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Name should not be empty"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_-])[A-Za-z\d!@#$%&*_-]{8,15}$/).required().messages({
        "string.empty": "Password should not be empty",
        "string.pattern.base": "Password should be at least 8 characters, at least one uppercase letter one digit and a special Character"
    }),
    confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
        "string.empty": "Confirm Password Should not be empty",
        "any.only": "Confirm Password should be same as password"
    }),
    role: Joi.string().regex(/^(customer|admin)$/).default("customer"),  //customer, seller,admin

    address: Joi.string().required(),
    phone: Joi.string().required()

})
const loginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const activationDTO = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().min(6).max(6).required()
})

const registerRiderDTO = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Name should not be empty"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_-])[A-Za-z\d!@#$%&*_-]{8,15}$/).required().messages({
        "string.empty": "Password should not be empty",
        "string.pattern.base": "Password should be at least 8 characters, at least one uppercase letter one digit and a special Character"
    }),
    confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
        "string.empty": "Confirm Password Should not be empty",
        "any.only": "Confirm Password should be same as password"
    }),
    role: Joi.string().regex(/^(rider|admin)$/).default("rider"),  //customer, seller,admin
    address: Joi.string().required(),
    location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }).allow(null),
    phone: Joi.string().required(),
    nid: Joi.number().required().messages({
        "number.base": "NID should be a number",
        "any.required": "NID is required"
    }),
    isVerified: Joi.boolean().default(false),
    isAvailable: Joi.boolean().default(false),
    vehicle: Joi.object({
        vehicleType: Joi.string().valid("car", "bike").default("bike"),
        model: Joi.string().required().messages({
            "string.empty": "Vehicle model is required"
        }),
        plateNumber: Joi.string().required().messages({
            "string.empty": "Plate number is required"
        }),
        registrationNumber: Joi.string().required().messages({
            "string.empty": "Registration number is required"
        }),
    }).required().messages({
        "any.required": "Vehicle details are required"
    })





})
const UpdateRiderStatusDTO = Joi.object({
    status: Joi.boolean().required().messages({
        "boolean.base": "Status should be a boolean",
        "any.required": "Status is required"
    }),

})


module.exports = {
    registerDataDTO,
    loginDTO,
    activationDTO,
    registerRiderDTO,
    UpdateRiderStatusDTO

}