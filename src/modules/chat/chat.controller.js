const authSvc = require("../auth/auth.service");
const chatSvc = require("./chat.service");

class ChatController {
    listAllUsers = async (req, res, next) => {
        try {


            const loggedInUser = req.authUser;
            let chatUsers;
            if (loggedInUser.role === 'admin') {
                chatUsers = await authSvc.getAllUsers({
                    _id: { $ne: loggedInUser.id }
                })
            } else {


                let withwhomIamChatting = await chatSvc.listAllChatsByUserId(loggedInUser.id)
                let chatUsersId = withwhomIamChatting.filter((user) => !user.equals(loggedInUser.id))
                chatUsers = await authSvc.getAllUsers({
                    _id: { $in: chatUsersId }
                })
            }
            res.json({
                data: chatUsers,
                message: "Users List",
                status: "USER_LIST",
                options: null

            })

        } catch (exception) {
            next(exception)

        }
    }
    getAllChats = async (req, res, next) => {
        try {
            const receiverId = req.params.receiverId;
           
            const senderId = req.authUser.id;

            const allChatList = await chatSvc.listAllChats(senderId, receiverId)

            res.json({
                data: allChatList,
                message: "Chat list",
                status: "CHAT_LIST",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    createChat = async (req, res, next) => {
        try {
            let loggedInUser = req.authUser.id

            let senderType

            if (req.authUser.role === 'customer' || req.authUser.role === 'admin') {
                senderType = 'User'
            } else {
                senderType = 'Rider'
            }


            let message = {
                sender: loggedInUser,
                senderType: senderType,
                receiver: req.body.receiver,
                receiverType: req.body.receiverType,
                message: req.body.message,

            }
            const chat = await chatSvc.storeChat(message)
            res.json({
                data: chat,
                message: "Chat created",
                status: "CHAT_CREATED",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }

}
const chatController = new ChatController()
module.exports = chatController