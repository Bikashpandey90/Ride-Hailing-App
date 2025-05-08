const SavedLocationModel = require("./misc.model")

class MiscServices {

    createSaveAddress = async (userId, locationName, location, isDefault, status, title) => {

        try {

            const saveAddress = new SavedLocationModel({
                userId: userId,
                locationName: locationName,
                location: location,
                isDefault: isDefault,
                status: status,
                title: title,

            })

            await saveAddress.save()

            return saveAddress



        } catch (exception) {
            console.log("CreateSaveAddress Exception : ", exception)
            throw exception
        }
    }

    getMySavedAdress = async (userId) => {
        try {
            let filter = {
                userId: userId

            }

            const saveAddress = SavedLocationModel.find(filter)

            if (!saveAddress) {
                return null
            }
            if (saveAddress.length === 0) {
                return null
            }

            return saveAddress


        } catch (exception) {
            console.log("getMySavedAddress Exception : ", exception)
            throw exception

        }
    }

    getSavedAddressById = async (savedAddressId) => {
        try {
            const response = await SavedLocationModel.findById(savedAddressId)
            return response

        } catch (exception) {
            console.log("getSavedAddressById exception : ", exception)
            throw exception

        }
    }

    deleteSavedAddressById = async (savedAddressId) => {
        try {

            const response = await SavedLocationModel.findByIdAndDelete(savedAddressId)
            return response

        } catch (exception) {
            console.log("deleteSavedAddressById exception : ", exception)
            throw exception
        }
    }
    updateSavedAddressById = async (savedAddressId, data) => {
        try {
            const response = await SavedLocationModel.findByIdAndUpdate(savedAddressId, { $set: data }, { new: true })
            return response

        } catch (exception) {
            console.log("updateSavedAddressById exception : ", exception)
            throw exception

        }
    }

}
const miscSvc = new MiscServices();
module.exports = miscSvc;
