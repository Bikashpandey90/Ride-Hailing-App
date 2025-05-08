const authSvc = require("../auth/auth.service");
const miscSvc = require("./misc.services");

class MiscController {

    saveAddress = async (req, res, next) => {
        try {
            const { locationName, location, isDefault, status = 'active', title } = req.body

            const userId = req.authUser.id
            console.log("userId : ", userId)

            if (!userId) {
                return res.json({
                    status: "INVALID_USER",
                    message: "User not found",
                    options: null

                })
            }


            const response = await miscSvc.createSaveAddress(userId, locationName, location, isDefault, status, title)
            res.json({
                detail: response,
                status: "SAVED_ADDRESS_SUCCESSFULLY",
                message: "Address saved !",
                options: null

            })

        } catch (exception) {
            next(exception)

        }
    }

    getSavedAddress = async (req, res, next) => {
        try {

            const userId = req.authUser.id

            const user = await authSvc.getSingleUserByFilter(userId)
            if (!user) {
                return res.json({
                    status: "INVALID_USER",
                    message: "User not found",
                    options: null

                })
            }

            const response = await miscSvc.getMySavedAdress(user._id)
            if (!response) {
                return res.json({
                    detail: null,
                    status: "NO_SAVED_ADDRESS",
                    message: "No saved address found",
                    options: null

                })
            }
            if (response.length === 0) {
                return res.json({
                    detail: null,
                    status: "NO_SAVED_ADDRESS",
                    message: "No saved address found",
                    options: null

                })
            }
            res.json({
                detail: response,
                status: "YOUR_SAVED_ADRESSES",
                message: "Your saved addresses !",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }

    getSavedAddressDetail = async (req, res, next) => {
        try {
            const saveAddressId = req.params.id

            const userId = req.authUser.id



            const AddressDetail = await miscSvc.getSavedAddressById(saveAddressId)


            if (!AddressDetail) {
                return res.json({
                    detail: null,
                    status: "ADDRESS_NOT_FOUND",
                    message: "Address not found",
                    options: null

                })
            }
            if (AddressDetail.userId.toString() !== userId.toString()) {
                return res.json({
                    detail: null,
                    status: "INVALID_USER",
                    message: "User not found",
                    options: null

                })
            }

            res.json({
                detail: AddressDetail,
                status: "ADDRESS_DETAIL",
                message: "Address detail ",
                options: null

            })


        } catch (exception) {
            next(exception)
        }
    }

    deleteSavedAddress = async (req, res, next) => {
        try {
            const savedAddressId = req.params.id
            const userId = req.authUser.id

            const Address = await miscSvc.getSavedAddressById(savedAddressId)

            if (Address.userId.toString() !== userId.toString()) {
                return res.json({
                    detail: null,
                    status: "INVALID_USER",
                    message: "User not found",
                    options: null

                })
            }

            if (!Address) {
                return res.json({
                    detail: null,
                    status: "ADDRESS_NOT_FOUND",
                    message: "Address not found",
                    options: null

                })
            }


            const response = await miscSvc.deleteSavedAddressById(Address._id)

            if (!response) {
                return res.json({
                    detail: null,
                    status: "ADDRESS_NOT_FOUND",
                    message: "Address not found",
                    options: null

                })
            }
            res.json({
                detail: response,
                status: "ADDRESS_DELETED",
                message: "Address deleted successfully",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }

    updateSavedAddress = async (req, res, next) => {
        try {

            //todo: update saved address
            // const { locationName, location, isDefault, status, title } = req.body

            // const savedAddressId = req.params.id

            const { title } = req.body
            const savedAddressId = req.params.id

            const userId = req.authUser.id

            const Address = await miscSvc.getSavedAddressById(savedAddressId)
            if (Address.userId.toString() !== userId.toString()) {
                return res.json({
                    detail: null,
                    status: "INVALID_USER",
                    message: "User not found",
                    options: null

                })
            }

            if (!Address) {
                return res.json({
                    detail: null,
                    status: "ADDRESS_NOT_FOUND",
                    message: "Address not found",
                    options: null

                })
            }
            const response = await miscSvc.updateSavedAddressById(savedAddressId, title)

            if (!response) {
                return res.json({
                    detail: null,
                    status: "ADDRESS_NOT_FOUND",
                    message: "Address not found",
                    options: null

                })
            }
            return res.json({
                detail: response,
                status: "ADDRESS_UPDATED",
                message: "Address updated successfully",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }
}

const miscCtrl = new MiscController();
module.exports = miscCtrl;