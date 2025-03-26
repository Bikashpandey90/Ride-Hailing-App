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

}
const rideCtrl = new RideController()
module.exports = rideCtrl