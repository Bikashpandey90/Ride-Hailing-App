const authSvc = require("../auth/auth.service");
const rideSvc = require("./ride.service");

class RideController {

    requestRide = async (req, res, next) => {
        try {

            const userId = req.authUser.id
            const { pickUpLocation, dropOffLocation, vehicleType } = req.body
            if (pickUpLocation.name === 'Current Location') {
                pickUpLocation.name = await rideSvc.getLocationName(pickUpLocation.coordinates[1], pickUpLocation.coordinates[0])
            }



            const ride = await rideSvc.createRide(userId, pickUpLocation, dropOffLocation, vehicleType)

            if (!ride) {
                return res.json({
                    detail: null,
                    status: "RIDE_CREATE_FAILED",
                    message: "Ride creation failed",
                    options: null

                })
            }
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
            const rideCheck = await rideSvc.getSingleRideByFilter({
                _id: rideId
            })

            if (!rideCheck) {
                return res.json({
                    detail: null,
                    status: "RIDE_NOT_FOUND",
                    message: "Ride not found",
                    options: null

                })

            }
            if (rideCheck.RideStatus === 'accepted' && rideCheck?.rider === riderDetails.id.toString()) {

                return res.json({
                    detail: null,
                    status: "RIDE_ALREADY_ACCEPTED",
                    message: "Ride is already accepted by you",
                    options: null

                })
            }
            if (rideCheck.RideStatus === 'accepted' && rideCheck?.rider !== riderDetails.id.toString()) {

                return res.json({
                    detail: null,
                    status: "RIDE_NOT_AVAILABLE",
                    message: "Ride is already accepted by others",
                    options: null

                })
            }

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
                transactionCode: data.transactionCode || Date.now(),
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

            const userId = req.authUser.id






            const rideDetail = await rideSvc.getSingleRideByFilter({
                _id: rideId
            })





            //manage user handling user and rider should be allowed to see their rides only

            //check this one and done

            // if (rideDetail.userId !== userId.toString() || rideDetail.rider !== userId.toString()) {
            //     return res.json({
            //         details: null,
            //         status: "USER_UNAUTHORIZED",
            //         messages: "You cannot view other ride",
            //         options: null

            //     })
            // }


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
    getRecentRideLocations = async (req, res, next) => {
        try {
            const userId = req.authUser.id
            const userCheck = await authSvc.getSingleUserByFilter(userId)
            if (!userCheck) {
                return res.json({
                    detail: null,
                    status: "USER_NOT_FOUND",
                    message: "User not found",
                    options: null

                })
            }
            const rideLocations = await rideSvc.getRecentRideLocation(userCheck._id)

            console.log(userCheck._id)

            res.json({
                detail: rideLocations,
                status: "RIDE_LOCATION_FETCH_SUCCESS",
                message: "Ride location fetched successfully",
                options: null

            })


        } catch (exception) {
            next(exception)
        }
    }

    cancelRide = async (req, res, next) => {
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

            const userId = req.authUser.id
            const userCheck = await authSvc.getSingleUserByFilter(userId)
            if (!userCheck) {
                return res.json({
                    detail: null,
                    status: "USER_NOT_FOUND",
                    message: "User not found",
                    options: null

                })
            }
            if (rideDetail.userId && rideDetail.userId.toString() !== userCheck._id.toString()) {
                return res.json({
                    detail: null,
                    status: "RIDE_NOT_CANCELABLE",
                    message: "Ride not cancelable",
                    options: null

                })

            }

            if (rideDetail.RideStatus === 'completed') {
                return res.json({
                    detail: null,
                    status: "RIDE_ALREADY_COMPLETED",
                    message: "Ride already completed",
                    options: null

                })
            }
            if (rideDetail.RideStatus === 'cancelled') {
                return res.json({
                    detail: null,
                    status: "RIDE_ALREADY_CANCELLED",
                    message: "Ride already cancelled",
                    options: null

                })
            }
            if (rideDetail.RideStatus === 'ongoing') {
                return res.json({
                    detail: null,
                    status: "RIDE_ONGOING",
                    message: "Ride is ongoing",
                    options: null

                })
            }
            if (rideDetail.RideStatus !== 'accepted' && rideDetail.RideStatus !== 'pending') {
                return res.json({
                    detail: null,
                    status: "RIDE_NOT_CANCELABLE",
                    message: "Ride is not cancelable",
                    options: null

                })
            }



            const response = await rideSvc.updateRideDetails(rideId, { RideStatus: 'cancelled' })
            res.json({
                detail: response,
                status: "RIDE_CANCELLED",
                message: "Ride cancelled successfully",
                options: null

            })


        } catch (exception) {
            next(exception)
        }
    }


    getMyRides = async (req, res, next) => {
        try {
            //todo

        } catch (exception) {
            next(exception)
        }
    }

}
const rideCtrl = new RideController()
module.exports = rideCtrl