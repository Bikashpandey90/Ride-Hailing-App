const RideModel = require('./ride.model');
const axios = require('axios');
const TransactionModel = require('./transactions/transaction.model');


class RideService {

    calculateFare = async (distance, time, vehicleType) => {
        try {
            if (!distance || !time || !vehicleType) {
                throw new Error('Invalid distance, time, or vehicle type');
            }
            // const distanceTime = await this.calculateDistanceTime(pickup, destination);


            let fare;
            if (vehicleType === 'car') {
                fare = distance * 10 + time * 2; // Example fare calculation for car
            } else if (vehicleType === 'bike') {
                fare = distance * 5 + time * 1; // Example fare calculation for bike
            } else {
                throw new Error('Unsupported vehicle type');
            }

            return fare;
        } catch (exception) {
            throw exception;
        }
    }
    calculateDistanceTime = async (pickup, destination) => {
        try {
            const distanceObject = await this.calculateDistance(pickup, destination);
            const distance = distanceObject.distance;

            // Assuming an average speed of 40 km/h for calculation
            const averageSpeed = 40; // in km/h
            const time = distance / averageSpeed; // time in hours

            console.log(time);
            return {
                distance,
                time: parseFloat((time * 60).toFixed(2)) // Convert time to minutes and ensure it's a number
            };


        } catch (exception) {
            throw exception;
        }
    }
    calculateDistance = async (pickup, destination) => {
        try {

            const response = await axios.get('https://router.project-osrm.org/route/v1/driving/' +
                `${pickup.coordinates[0]},${pickup.coordinates[1]};${destination.coordinates[0]},${destination.coordinates[1]}`, {
                params: {
                    overview: 'false',
                    geometries: 'geojson'
                }
            });

            if (response.data && response.data.routes && response.data.routes.length > 0) {
                const distance = response.data.routes[0].distance; // Distance in meters
                console.log("Calculated Distance : ", distance / 1000)

                return { distance: parseFloat((distance / 1000).toFixed(2)) }; // Convert meters to kilometers and round to 2 decimal places

            } else {
                throw new Error('Unable to calculate route distance');
            }
        } catch (exception) {
            throw exception;
        }
    }



    createRide = async (user, pickup, destination, vehicleType) => {
        try {

            const distanceTimeObj = await this.calculateDistanceTime(pickup, destination);

            const distanceTime = distanceTimeObj.time

            // if (isNaN(distanceTime.distance) || distanceTime.distance === undefined) {
            //     throw new Error("Invalid distance calculated. Cannot create ride.");
            // }
            // const distanceObject = await this.calculateDistance(pickup, destination);
            const distance = distanceTimeObj.distance;

            // Ensure `fare` calculation does not result in NaN
            const fare = isNaN(distance) ? 0 : await this.calculateFare(distance, distanceTime, vehicleType);

            const ride = await RideModel.create({
                userId: user,
                pickUpLocation: pickup,
                dropOffLocation: destination,
                vehicleType,
                fare,
                distance,
                distanceTime
            })

            return ride

        } catch (exception) {
            throw exception
        }
    }


    fetchRecentRides = async (riderLocation, vehicleType) => {
        try {
            let filter = {
                vehicleType: vehicleType,
                RideStatus: 'pending'

            }


            const response = await RideModel.find({
                ...filter,
                pickUpLocation: {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [riderLocation.longitude, riderLocation.latitude]
                        },
                        $maxDistance: 1000, // 1 km radius
                    }
                }

            }).populate('userId', ["_id", "name", "email", "status", "image", 'phone'])
            return response

        } catch (exception) {
            throw exception
        }
    }
    updateRideWithRider = async (rideId, riderDetails) => {
        try {
            console.log(riderDetails, "services")




            const response = await RideModel.findByIdAndUpdate(
                rideId,
                {
                    rider: riderDetails.id,
                    vehicleDetails: riderDetails.vehicle,
                    status: "accepted",
                    RideStatus: "accepted"

                },
                { new: true })
                .populate('rider', ["_id", "name", "email", "status", 'image', 'phone'])
                .populate('userId', ["_id", "name", "email", "status", 'image', 'phone'])
            return response

        } catch (exception) {
            throw exception
        }
    }
    updateRideDetails = async (rideId, data) => {
        try {
            const response = await RideModel.findByIdAndUpdate(rideId, {
                status: data.status,
                RideStatus: data.RideStatus

            }, {
                new: true
            })
                .populate('rider', ["_id", "name", "email", "status", 'image'])
                .populate('userId', ["_id", "name", "email", "status", 'image'])
            return response

        } catch (exception) {
            console.log("updateRideDetails exception : ", exception)
            throw exception
        }
    }
    getSingleRideByFilter = async (filter) => {
        try {
            const rideDetail = await RideModel.findOne(filter)
                .populate('rider', ["_id", "name", "email", "status", 'image', 'phone'])
                .populate('userId', ["_id", "name", "email", "status", 'image', 'phone'])


            if (!rideDetail) {
                throw { code: 400, message: "Ride Not found", status: "RIDE_NOT_FOUND" }
            }
            return rideDetail

        } catch (exception) {
            console.log("getSingleRideById exception : ", exception)
            throw exception
        }
    }
    getAllOrderByDetail = async (filter) => {
        try {
            const rides = await RideModel.find(filter)

            return rides

        } catch (exception) {
            console.log("getAllOrderByDetail exception : ", exception)
            throw exception
        }
    }
    populateTransation = async (transactionData) => {
        try {
            const transactionObj = new TransactionModel(transactionData)
            return await transactionObj.save()

        } catch (exception) {
            console.log("populateTransation exception : ", exception)
            throw exception
        }
    }
    updateOneRideByFilter = async (filter, data) => {
        try {
            const response = await RideModel.findOneAndUpdate(filter, { $set: data }, { new: true })
            return response
        } catch (exception) {
            console.log("updateOneRideByFilter exception : ", exception)
            throw exception

        }
    }
    deleteRideById = async (rideId) => {
        try {
            const response = await RideModel.findByIdAndDelete(rideId)
            return response

        } catch (exception) {
            console.log("deleteRideById exception : ", exception)
            throw exception
        }
    }
    getRecentRideLocation = async (userId) => {
        try {
            let filter = {
                userId: userId,
                status: "completed"
            }
            const response = await RideModel.find(filter)
                .sort({ createdAt: -1 })
                .limit(3)
                // .distinct('dropOffLocation pickUpLocation')
                .select("pickUpLocation dropOffLocation")
            if (response.length === 0) {
                return null
            }


            return response

        } catch (exception) {
            console.log("getRecentRideLocation exception : ", exception)
            throw exception
        }
    }
    getLocationName = async (lat, lng) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)

            return response.data.display_name


        } catch (exception) {
            console.log("getLocationName exception : ", exception)
            throw exception
        }
    }

    fetchUsersRecentRides = async (userId, status) => {
        try {
            let filter = {
                userId: userId,
                RideStatus: status
            }

            const response = await RideModel.find(filter)
                .populate('rider', ['name', 'email', 'image'])
                .sort({ createdAt: -1 })
            return response

        } catch (exception) {
            console.log("fetchUsersRecentRides exception : ", exception)
            throw exception
        }
    }

}
const rideSvc = new RideService();
module.exports = rideSvc