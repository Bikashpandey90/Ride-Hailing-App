const mongoose = require("mongoose")
const { commonStr } = require("../../common/schema");



const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    discountType: {
        type: String,
        enum: ["flat", "percent"],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    maxDiscount: Number, // only relevant for percent
    minRideAmount: Number,
    usageLimit: Number, // how many times a coupon can be used globally
    usedCount: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        required: true,
        max: 30
    },
    startDate: Date,
    expiryDate: Date,
    ...commonStr

}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
});

const OfferModel = mongoose.model("Offer", couponSchema)
module.exports = OfferModel
