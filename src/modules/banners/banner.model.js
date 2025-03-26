const mongoose = require("mongoose");
const { commonStr, schemaOpts } = require("../../common/schema");
const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        min: 3,
        max: 100,
        required: true
    },
    link: {
        type: String,
        default: null
    },
    image: {
        type: String,
        required: true
    }, startDate: Date
    , endDate: Date,
    ...commonStr

}, schemaOpts);
const BannerModel = mongoose.model("Banner", BannerSchema)   //collection name(table)=> banners



module.exports = BannerModel