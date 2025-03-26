const mongoose = require("mongoose");
const { commonStr } = require("../common/schema");

const RiderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'rider'],
        default: 'rider'
    },

    image: String,
    phone: String,
    license: String,
    address: String,
    otp: String,
    otpExpiryTime: Date,


    // Rider-specific fields
    isVerified: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    nid: {
        type: Number,
        required: true
    },
    location: {
        type: {
            latitude: Number,
            longitude: Number
        },
        default: null
    },


    vehicle: {
        vehicleType: {
            type: String,
            enum: ['car', 'bike'],
            required: true
        },
        model: {
            type: String,
            required: true
        },
        plateNumber: {
            type: String,
            required: true
        },
        registrationNumber: {
            type: String,
            required: true
        }
    },

    ...commonStr

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});


const RiderModel = mongoose.model("Rider", RiderSchema);

module.exports = RiderModel;
