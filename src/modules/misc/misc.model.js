const { default: mongoose } = require("mongoose");
const { commonStr } = require("../../common/schema");

const SavedLocationsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    locationName: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],//[longitude,latitude]
            required: true
        }
    },

    isDefault: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        enum: ['home', 'work', 'recent'],
        required: true
    },
    ...commonStr
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})
const SavedLocationModel = mongoose.model("Saved", SavedLocationsSchema)
module.exports = SavedLocationModel