const rideSvc = require("./ride.service");

class RideController {

    requestRide = async (req, res, next) => {
        try {

            const { userId, pickUpLocation, dropOffLocation, vehicleType } = req.body
            const ride = await rideSvc.createRide(userId, pickUpLocation, dropOffLocation, vehicleType)

            res.json({

                detail: ride,
                status: "RIDE_CREATE_SUCCESS",
                message: "Ride requested successfully",
                options: null

            })




        } catch (exception) {
            next(exception);
        }
    }
    getRides = async (req, res, next) => {
        try {
            const riderLocation = req.body.location
            const vehicleType = req.authUser.vehicle.vehicleType

            console.log(riderLocation, vehicleType)


            const rides = await rideSvc.fetchRecentRides(riderLocation, vehicleType)

            res.json({
                detail: rides,
                status: "RIDE_FETCH_SUCCESS",
                message: "Ride fetched successfully",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }
    confirmRide = async (req, res, next) => {
        try {
            const rideId = req.body.rideId; // Correctly assign rideId
            const riderDetails = req.authUser;
            console.log(riderDetails);
            const ride = await rideSvc.updateRideWithRider(rideId, riderDetails);

            res.json({
                detail: ride,
                status: "RIDE_ASSIGNED",
                message: "Ride assigned successfully",
                options: null
            });

        } catch (exception) {
            next(exception);
        }
    }
    updateRideStatus = async (req, res, next) => {
        try {

            const data = req.body
            const rideId = req.body.rideId
            const response = await rideSvc.updateRideDetails(rideId, data)

            res.json({
                detail: response,
                status: "RIDE_UPDATED",
                message: "Ride updated successfully",
                options: null

            })




        } catch (exception) {
            next(exception)
        }
    }
    makePayment = async (req, res, next) => {
        try {
            const rideId = req.params.id
            const data = req.body
            const rideDetail = await rideSvc.getSingleRideByFilter({
                _id: rideId
            })
            if (rideDetail.status !== 'completed') {
                return res.json({
                    detail: null,
                    status: "CANNOT_MAKE_PAYMENT_NOW",
                    message: "Cannot make payment before ride completion",
                    options: null

                })
            }
            const transactionObj = {
                rideId: rideDetail._id,
                amount: data.amount,
                paymentMethod: data.paymentMethod || 'cash',
                transctionCode: data.transctionCode || Date.now(),
                data: data.data || null
            }
            const transaction = await rideSvc.populateTransation(transactionObj)

            await rideSvc.updateOneRideByFilter({
                _id: rideId

            }, { isPaid: true, paymentStatus: 'paid' })


            res.json({
                detail: transaction,
                status: "PAYMENT_SUCCESS",
                message: "Payment successful",
                options: null

            })



        } catch (exception) {
            next(exception)
        }
    }
    getRideDetail = async (req, res, next) => {
        try {
            const rideId = req.params.id

            const rideDetail = await rideSvc.getSingleRideByFilter({
                _id: rideId
            })


            //manage user handling user and rider should be allowed to see their rides only


            if (!rideDetail) {
                return res.json({
                    detail: null,
                    status: "RIDE_NOT_FOUND",
                    message: "Ride not found",
                    options: null

                })
            }

            res.json({
                detail: rideDetail,
                status: "RIDE_FETCH_SUCCESS",
                message: "Ride fetched successfully",
                options: null

            })

        } catch (exception) {
            next(exception)
        }
    }
    deleteRide = async (req, res, next) => {
        try {
            const rideId = req.params.id
            const rideDetail = await rideSvc.getSingleRideByFilter({
                _id: rideId
            })
            if (!rideDetail) {
                return res.json({
                    detail: null,
                    status: "RIDE_NOT_FOUND",
                    message: "Ride not found",
                    options: null

                })
            }

            await rideSvc.deleteRideById(rideId)


        } catch (exception) {
            next(exception)
        }
    }
    updateRide = async (req, res, next) => {
        try {
            const rideId = req.params.id
            const rideDetail = await RideModel.findById(rideId)
            const data = req.body
            
            if (!rideDetail) {
                return res.json({
                    detail: null,
                    status: "RIDE_NOT_FOUND",
                    message: "Ride not found",
                    options: null

                })
            }
            const response = await rideSvc.updateRideDetails(rideId, data)

            res.json({
                detail: response,
                status: "RIDE_UPDATED",
                message: "Ride updated successfully",
                options: null

            })




        } catch (exception) {
            next(exception)
        }
    }

}
const rideCtrl = new RideController()
module.exports = rideCtrl