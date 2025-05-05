const chatRouter = require('express').Router()

const { checkLogin, checkLoginRider, checkLoginEither } = require('../middlewares/auth.middleware')
const bodyValidator = require('../middlewares/bodyvalidator.middleware')
const chatController = require('./chat.controller')
const { ChatMessageDTO } = require('./chat.validator')

//todo : fix these routes for rider

chatRouter.get('/list-user', checkLoginEither, chatController.listAllUsers)
chatRouter.get('/detail/:receiverId', checkLoginEither, chatController.getAllChats)
chatRouter.post('/send', checkLoginEither, bodyValidator(ChatMessageDTO), chatController.createChat)




module.exports = chatRouter