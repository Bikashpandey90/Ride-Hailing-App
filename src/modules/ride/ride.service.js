const RideModel = require('./ride.model');
const axios = require('axios')


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
            // const distance = geolib.getDistance(
            //     { latitude: pickup.latitude, longitude: pickup.longitude },
            //     { latitude: destination.latitude, longitude: destination.longitude }
            // );
            // console.log(distance)
            // return { distance: distance / 1000 }; // Convert meters to kilometers

            const response = await axios.get('https://router.project-osrm.org/route/v1/driving/' +
                `${pickup.longitude},${pickup.latitude};${destination.longitude},${destination.latitude}`, {
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



    // calculateDistance = async (pickup, destination) => {
    //     try {
    //         const response = await axios.get(
    //             `https://router.project-osrm.org/route/v1/driving/${pickup.longitude},${pickup.latitude};${destination.longitude},${destination.latitude}`,
    //             {
    //                 params: {
    //                     overview: 'false',
    //                     geometries: 'geojson'
    //                 }
    //             }
    //         );

    //         if (!response.data || !response.data.routes || response.data.routes.length === 0) {
    //             throw new Error("OSRM API returned an invalid response for distance calculation.");
    //         }

    //         const distance = response.data.routes[0].distance; // Distance in meters
    //         if (isNaN(distance) || distance <= 0) {
    //             throw new Error("Invalid distance value received from API.");
    //         }

    //         console.log("Calculated Distance:", (distance / 1000).toFixed(2));
    //         return { distance: parseFloat((distance / 1000).toFixed(2)) }; // Convert meters to km
    //     } catch (exception) {
    //         console.error("Error calculating distance:", exception.message);
    //         throw exception;
    //     }
    // };
    // calculateDistance = async (pickup, destination) => {
    //     try {
    //         const response = await axios.get(
    //             `https://router.project-osrm.org/route/v1/driving/${pickup.longitude},${pickup.latitude};${destination.longitude},${destination.latitude}`,
    //             { params: { overview: 'false', geometries: 'geojson' } }
    //         );

    //         if (!response.data || !response.data.routes || response.data.routes.length === 0) {
    //             throw new Error("OSRM API returned an invalid response.");
    //         }

    //         const distance = response.data.routes[0].distance / 1000; // Convert meters to km
    //         return { distance: parseFloat(distance.toFixed(2)) };
    //     } catch (exception) {
    //         console.error("OSRM failed, trying alternative API...", exception.message);

    //         // Use Google Maps API as a fallback (requires an API key)
    //         const googleMapsURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickup.latitude},${pickup.longitude}&destinations=${destination.latitude},${destination.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;

    //         try {
    //             const googleResponse = await axios.get(googleMapsURL);
    //             if (googleResponse.data && googleResponse.data.rows[0].elements[0].distance) {
    //                 const distance = googleResponse.data.rows[0].elements[0].distance.value / 1000; // Convert meters to km
    //                 return { distance: parseFloat(distance.toFixed(2)) };
    //             } else {
    //                 throw new Error("Google Maps API returned an invalid response.");
    //             }
    //         } catch (googleError) {
    //             console.error("Google Maps API failed as well.", googleError.message);
    //             throw new Error("Unable to fetch distance from any API.");
    //         }
    //     }
    // };


    createRide = async (user, pickup, destination, vehicleType) => {
        try {

            const distanceTimeObj = await this.calculateDistanceTime(pickup, destination);
            const distanceTime = distanceTimeObj.time

            // if (isNaN(distanceTime.distance) || distanceTime.distance === undefined) {
            //     throw new Error("Invalid distance calculated. Cannot create ride.");
            // }
            const distanceObject = await this.calculateDistance(pickup, destination);
            const distance = distanceObject.distance;

            // Ensure `fare` calculation does not result in NaN
            const fare = isNaN(distance) ? 0 : await this.calculateFare(pickup, destination, vehicleType);

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
    fetchRecentRides = async (riderLocation) => {
        try {

            const response = await RideModel.find({
                pickUpLocation: {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [riderLocation.latitude, riderLocation.longitude]
                        },
                        $maxDistance: 1000, // 1 km radius
                    }
                }

            })
            return response

        } catch (exception) {
            throw exception
        }
    }
    updateRideWithRider = async (rideId, riderDetails) => {
        try {
            const response = await RideModel.findByIdAndUpdate(
                rideId,
                {
                    rider: riderDetails._id,
                    vehicleDetails: riderDetails.vehicle,
                    status: "accepted"

                },
                { new: true })
            return response

        } catch (exception) {
            throw exception
        }
    }
    updateRideDetails = async (rideId, data) => {
        try {
            const response = await RideModel.findByIdAndUpdate(rideId, {
                status: data.status
            }, {
                new: true
            })
            return response

        } catch (exception) {
            console.log("updateRideDetails exception : ", exception)
            throw exception
        }
    }

}
const rideSvc = new RideService();
module.exports = rideSvc