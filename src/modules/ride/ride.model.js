const mongoose = require("mongoose");

const { required } = require("joi");
const { commonStr } = require("../../common/schema");

const RideSchema = new mongoose.Schema({
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rider",
        required: false // Rider may not be assigned immediately for scheduled rides
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pickUpLocation: {
        type: {
            latitude: Number,
            longitude: Number
        },
        required: true
    },
    dropOffLocation: {
        type: {
            latitude: Number,
            longitude: Number
        },
        required: true
    },
    fare: {
        type: Number,
        // required: true
        default: 0
    },
    distance: {
        type: Number, // Distance in kilometers
        // required: true
        default: 0
    },
    status: {
        type: String,
        enum: ['scheduled', 'pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    paymentId: {
        type: String,
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String

    },
    vehicleType: {
        type: String,
        required: true

    },
    vehicleDetails: {
        vehicleType: {
            type: String,
            enum: ['car', 'bike'],
            // required: true
        },
        model: String,
        plateNumber: String
    },
    rideStartTime: Date,
    rideEndTime: Date,

    // 🔹 Scheduled Ride Fields
    isScheduled: {
        type: Boolean,
        default: false
    },
    scheduledTime: {
        type: Date,
        required: function () { return this.isScheduled; } // Required if ride is scheduled
    },

    ...commonStr
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});
RideSchema.index({ "pickUpLocation": "2dsphere" });

const RideModel = mongoose.model("Ride", RideSchema);

module.exports = RideModel;
