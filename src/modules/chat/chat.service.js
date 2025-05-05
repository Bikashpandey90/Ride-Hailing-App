const ChatModel = require("./chat.model")

class ChatService {
    listAllChatsByUserId = async (userId) => {
        try {
            const chatList = await ChatModel.find({
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            }, {
                sender: 1,
                receiver: 1
            })
            let chatUsers = new Set()
            chatList.forEach(chat => {
                if (chat.sender.toString() !== userId.toString()) chatUsers.add(chat.sender)
                if (chat.receiver.toString() !== userId.toString()) chatUsers.add(chat.receiver)
            })
            return Array.from(chatUsers)

        } catch (exception) {
            throw exception

        }
    }
    listAllChats = async (senderId, receiverId) => {
        try {
            const chatList = await ChatModel.find({
                $or: [
                    { sender: senderId, receiver: receiverId },
                    { receiver: senderId, sender: receiverId }
                ]
            })
            return chatList

        } catch (exception) {
            throw exception
        }
    }
    storeChat = async (message) => {
        try {
            const chatObj = new ChatModel(message)
            return await chatObj.save()

        } catch (exception) {
            throw exception
        }
    }

}
const chatSvc = new ChatService()
module.exports = chatSvc
