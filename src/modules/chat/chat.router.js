const chatRouter = require('express').Router()

const { checkLogin, checkLoginRider } = require('../middlewares/auth.middleware')
const bodyValidator = require('../middlewares/bodyvalidator.middleware')
const chatController = require('./chat.controller')
const { ChatMessageDTO } = require('./chat.validator')

//todo : fix these routes for rider

chatRouter.get('/list-user', [checkLogin], chatController.listAllUsers)
// chatRouter.get('/detail/:receiverId', [checkLogin, checkLoginRider], chatController.getAllChats)
// chatRouter.post('/send', checkLogin, bodyValidator(ChatMessageDTO), chatController.createChat)




module.exports = chatRouter