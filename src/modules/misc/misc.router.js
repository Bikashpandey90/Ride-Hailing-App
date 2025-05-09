const { checkLogin } = require('../middlewares/auth.middleware');
const { allowedRoles } = require('../middlewares/rbac.middleware');
const miscCtrl = require('./misc.controller');

const miscRouter = require('express').Router();

miscRouter.post('/save-address', checkLogin, allowedRoles(['admin', 'customer']), miscCtrl.saveAddress)
miscRouter.get('/get-saved-address', checkLogin, allowedRoles(['admin', 'customer']), miscCtrl.getSavedAddress)

miscRouter.route('/:id')
    .get(checkLogin, allowedRoles(['admin', 'customer']), miscCtrl.getSavedAddressDetail)
    .delete(checkLogin, allowedRoles(['admin','customer']), miscCtrl.deleteSavedAddress)
    .patch(checkLogin, allowedRoles(['admin', 'customer']), miscCtrl.updateSavedAddress)

module.exports = miscRouter;