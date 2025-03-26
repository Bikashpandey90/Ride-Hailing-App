const geolib = require('geolib');
const RideModel = require('./ride.model');


class RideService {

    calculateFare = async (pickup, destination, vehicleType) => {
        try {
            if (!pickup || !destination || !vehicleType) {
                throw new Error('Invalid pickup, destination, or vehicle type');
            }
            const distanceTime = await this.calculateDistanceTime(pickup, destination);

            let fare;
            if (vehicleType === 'Car') {
                fare = distanceTime.distance * 10 + distanceTime.time * 2; // Example fare calculation for car
            } else if (vehicleType === 'Bike') {
                fare = distanceTime.distance * 5 + distanceTime.time * 1; // Example fare calculation for bike
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
            const { distance } = await this.calculateDistance(pickup, destination);

            // Assuming an average speed of 40 km/h for calculation
            const averageSpeed = 40; // in km/h
            const time = distance / averageSpeed; // time in hours

            console.log(time)
            return {
                distance,
                time: time * 60 // Convert time to minutes
            };


        } catch (exception) {
            throw exception;
        }
    }
    calculateDistance = async (pickup, destination) => {
        try {
            const distance = geolib.getDistance(
                { latitude: pickup.latitude, longitude: pickup.longitude },
                { latitude: destination.latitude, longitude: destination.longitude }
            );
            console.log(distance)
            return { distance: distance / 1000 }; // Convert meters to kilometers
        } catch (exception) {
            throw exception;
        }
    }
    createRide = async (user, pickup, destination, vehicleType) => {
        try {

            const fare = await this.calculateFare(pickup, destination, vehicleType)

            const ride = RideModel.create({
                userId: user,
                pickUpLocation: pickup,
                dropOffLocation: destination,
                vehicleType,
                fare
            })

            return ride

        } catch (exception) {
            throw exception
        }
    }

}
const rideSvc = new RideService();
module.exports = rideSvc