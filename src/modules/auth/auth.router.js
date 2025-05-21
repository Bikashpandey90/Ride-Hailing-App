const authRouter = require('express').Router();

const { checkLogin, checkLoginRider, checkLoginEither } = require('../middlewares/auth.middleware');
const bodyValidator = require('../middlewares/bodyvalidator.middleware');
const uploader = require('../middlewares/multipart-parser.midlleware');
const authCtrl = require('./auth.controller');
const { allowedRoles } = require('../middlewares/rbac.middleware')
const { registerDataDTO, loginDTO, activationDTO, registerRiderDTO, UpdateRiderStatusDTO } = require('./auth.validator');



authRouter.post('/register', uploader().single('image'), bodyValidator(registerDataDTO), authCtrl.register)
authRouter.post('/activate', bodyValidator(activationDTO), authCtrl.activateUser)
authRouter.post('/login', bodyValidator(loginDTO), authCtrl.login)
authRouter.get('/me', checkLogin, authCtrl.getLoggedInUser)
authRouter.patch('/update-location', checkLogin, authCtrl.updateLocation)   //todo:validation


authRouter.post('/register-rider', uploader().single('image'), bodyValidator(registerRiderDTO), authCtrl.registerRider)
authRouter.post('/activate-rider', bodyValidator(activationDTO), authCtrl.activateRider)
authRouter.post('/login-rider', bodyValidator(loginDTO), authCtrl.loginRider)
authRouter.get('/me-rider', checkLoginRider, authCtrl.getLoggedInUser)
authRouter.patch('/update-location-rider', checkLoginRider, authCtrl.updateLocation)  //todo:validation
authRouter.patch('/update-ride-status-rider', checkLoginRider, bodyValidator(UpdateRiderStatusDTO), authCtrl.updateRiderStatus)  //todo:validation
authRouter.get('/list-riders', checkLogin, allowedRoles('admin'), authCtrl.listAllRiders)

authRouter.get('/user-detail/:id', checkLogin, allowedRoles('admin'), authCtrl.getUserDetails)
authRouter.get('/rider-detail/:id', checkLoginEither, allowedRoles(['admin', 'customer']), authCtrl.getRiderDetail)





module.exports = authRouter;