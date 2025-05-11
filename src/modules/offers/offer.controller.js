const offerSvc = require("./offer.services")

class OfferController {

    createOffer = async (req, res, next) => {
        try {
            const { code, description, discountType, discountValue, maxDiscount, minRideAmount, usageLimit, expiryDate, startDate, title } = req.body
            const isUnique = await offerSvc.checkOfferCode(code)
            const createdBy = req.authUser.id

            if (!isUnique) {
                console.log("No is unique")
                return res.status(400).json({
                    message: "Offer code already exists",
                    status: "OFFER_CODE_NOT_UNIQUE",
                    options: null
                })
            }

            if (isUnique === false) {
                return res.status(400).json({
                    message: "Offer code already exists",
                    status: "OFFER_CODE_NOT_UNIQUE",
                    options: null
                })
            }

            const offer = await offerSvc.createOfferCode(code, description, discountType, discountValue, maxDiscount, minRideAmount, usageLimit, expiryDate, startDate, title, createdBy)
            res.json({
                detail: offer,
                message: "Offer created successfully",
                status: "OFFER_CREATED",
                options: null

            })



        } catch (exception) {
            next(exception)
        }
    }
    checkOfferCodeUniqueness = async (req, res, next) => {

        try {
            const { couponCode } = req.body
            const isUnique = await offerSvc.checkOfferCode(couponCode)
            if (isUnique) {
                res.json({
                    message: "Offer code is unique",
                    status: "OFFER_CODE_UNIQUE",
                    options: null
                })
            } else {
                res.json({
                    message: "Offer code already exists",
                    status: "OFFER_CODE_NOT_UNIQUE",
                    options: null
                })
            }

        } catch (exception) {
            next(exception)
        }
        // try {
        //     const response = await RideModel.findOne({ couponCode });
        //     return response !== null;
        // } catch (exception) {
        //     throw exception;
        // }
    }

    getOffer = async (req, res, next) => {
        try {
            const { couponCode } = req.body
            const offer = await offerSvc.getOffer(couponCode)
            if (offer) {
                res.json({
                    detail: offer,
                    message: "Offer fetched successfully",
                    status: "OFFER_FETCHED",
                    options: null

                })
            } else {
                res.status(404).json({
                    message: "Offer not found",
                    status: "OFFER_NOT_FOUND",
                    options: null
                })
            }

        } catch (exception) {
            next(exception)
        }
    }

    getAllOffers = async (req, res, next) => {
        try {
            const offers = await offerSvc.getAllOffers()
            res.json({
                detail: offers,
                message: "Offers fetched successfully",
                status: "OFFERS_FETCHED",
                options: null

            })


        } catch (exception) {
            next(exception)
        }
    }

    deleteOffer = async (req, res, next) => {
        try {
            const { couponCode } = req.body
            const offer = await offerSvc.deleteOfferCode(couponCode)

            if (!offer) {
                return res.status(404).json({
                    message: "Offer not found",
                    status: "OFFER_NOT_FOUND",
                    options: null
                })
            }

            res.json({
                detail: offer,
                message: "Offer deleted successfully",
                status: "OFFER_DELETED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }

    updateOffer = async (req, res, next) => {
        try {
            const { offerCode, description, discountAmount, expiryTime, discountType, minAmount, status } = req.body

            const offer = await offerSvc.updateOfferCode({ offerCode, description, discountAmount, expiryTime, discountType, minAmount, status })

            if (!offer) {
                return res.status(404).json({
                    message: "Offer not found",
                    status: "OFFER_NOT_FOUND",
                    options: null
                })
            }

            res.json({
                detail: offer,
                message: "Offer updated successfully",
                status: "OFFER_UPDATED",
                options: null
            })



        } catch (exception) {
            next(exception)
        }
    }





}

const offerCtrl = new OfferController()
module.exports = offerCtrl