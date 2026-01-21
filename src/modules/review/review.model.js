const { default: mongoose } = require("mongoose");
const { commonStr, schemaOpts } = require("../../common/schema");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rider',
        required: true

    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5

    },
    comment: {
        type: String,
        maxlength: 500,
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true

    },
    ...commonStr

}, schemaOpts)

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review;