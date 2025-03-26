const mongoose = require("mongoose");
const { commonStr } = require("../common/schema");

const UserSchema = new mongoose.Schema({
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
        enum: ['admin', 'customer', 'rider'],
        default: 'customer'
    },

    image: String,
    phone: String,
    address: String,
    otp: String,
    otpExpiryTime: Date,
    ...commonStr
    // status:statusSchema,
    // createdBy:createdBy,
    // updatedBy:updatedBy

}, {
    timestamps: true,    //createdAt,updatedAt
    autoCreate: true,
    autoIndex: true
});


//model name:user,collection name=>users
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
