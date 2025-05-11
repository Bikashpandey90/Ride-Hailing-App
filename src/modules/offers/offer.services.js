const OfferModel = require("./offer.model");

class OfferServices {
    createOfferCode = async (
        code, description, discountType, discountValue, maxDiscount, minRideAmount, usageLimit, expiryDate, startDate, title,createdBy
    ) => {
        try {
            const offer = await OfferModel.create({
                code: code,
                description: description,
                discountType: discountType,
                discountValue: discountValue,
                maxDiscount: maxDiscount,
                minRideAmount: minRideAmount,
                usageLimit: usageLimit,
                expiryDate: expiryDate,
                status: 'active',
                startDate: startDate,
                title: title,
                createdBy: createdBy
            })

            return offer

        } catch (exception) {
            console.log("Create Offer Exception : ", exception);
            throw exception
        }
    }

    checkOfferCode = async (offerCode) => {
        try {
            const response = await OfferModel.findOne({
                code: offerCode
            })
            if (response) {
                return false
            } else {
                return true
            }

        } catch (exception) {
            console.log("Check Offer Code Exception : ", exception);
            throw exception
        }
    }

    getOffer = async (offerCode) => {
        try {
            const response = await OfferModel.findOne({
                offerCode: offerCode
            })
            if (response) {
                return response
            } else {
                return null
            }

        } catch (exception) {
            console.log("Get Offer Exception : ", exception);
            throw exception
        }
    }
    getAllOffers = async () => {
        try {
            const response = await OfferModel.find({})
            if (response) {
                return response
            } else {
                return null
            }

        } catch (exception) {
            console.log("Get All Offers Exception : ", exception);
            throw exception
        }
    }
    deleteOfferCode = async (offerCode) => {
        try {
            const response = await OfferModel.findOneAndDelete({
                offerCode: offerCode
            })
            if (!response) {
                return null;
            }
            return response


        } catch (exception) {
            console.log("Delete Offer Exception : ", exception);
            throw exception
        }
    }
    updateOfferCode = async (offerCode, description, discountAmount, expiryTime, discountType, minAmount, status) => {
        try {
            const response = await OfferModel.findOneAndUpdate({
                offerCode: offerCode
            }, {
                $set: {
                    description: description,
                    discountAmount: discountAmount,
                    expiryTime: expiryTime,
                    discountType: discountType,
                    minAmount: minAmount,
                    status: status
                }
            })

        } catch (exception) {
            console.log("Update Offer Exception : ", exception);
            throw exception
        }
    }

}



const offerSvc = new OfferServices();
module.exports = offerSvc;
