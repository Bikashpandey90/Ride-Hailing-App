const { default: mongoose } = require("mongoose");
const { commonStr } = require("../../../common/schema");

const TransactionSchema = mongoose.Schema({
    rideId: {
        type: mongoose.Types.ObjectId,
        ref: "Ride",
        required: true
    },
    transactionCode: {
        type: String,
        unique: true,
        // required: true

    },
    amount: {
        type: Number,
        required: true

    },
    paymentMethod: {
        type: String,
        enum: ['esewa', 'khalti', 'connectips', 'bank', 'cash', 'other'],
        default: 'cash'

    },
    data: {
        type: String
    },
    ...commonStr

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})
const TransactionModel = mongoose.model("Transaction", TransactionSchema);
module.exports = TransactionModel