const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderType',
        required: true
    },
    senderType: {
        type: String,
        enum: ['User', 'Rider'],
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'receiverType',
        required: true
    },
    receiverType: {
        type: String,
        enum: ['User', 'Rider'],
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});

const ChatModel = mongoose.model('Chat', ChatSchema);
module.exports = ChatModel;
