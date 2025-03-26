const { checkLogin } = require('../middlewares/auth.middleware');
const bodyValidator = require('../middlewares/bodyvalidator.middleware');
const uploader = require('../middlewares/multipart-parser.midlleware');
const { allowedRoles } = require('../middlewares/rbac.middleware');
const bannerCtrl = require('./banner.controller');
const { bannerCreateDTO, bannerUpdateDTO } = require('./banner.validator');

const bannerRouter = require('express').Router();

bannerRouter.get('/home-banner', bannerCtrl.getForHome)
bannerRouter.route('/')
    .post(checkLogin, allowedRoles('admin'), uploader().single('image'), bodyValidator(bannerCreateDTO), bannerCtrl.create)
    .get(checkLogin, allowedRoles('admin'), bannerCtrl.index)

bannerRouter.route('/:id')
    .get(checkLogin, allowedRoles('admin'), bannerCtrl.detail)
    .delete(checkLogin, allowedRoles('admin'), bannerCtrl.delete)
    .patch(checkLogin, allowedRoles('admin'), uploader().single('image'), bodyValidator(bannerUpdateDTO), bannerCtrl.update)

module.exports = bannerRouter