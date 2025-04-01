require("dotenv").config();
const bcrypt = require("bcryptjs");
const authSvc = require("./auth.service");
const jwt = require("jsonwebtoken");

class AuthController {

    register = async (req, res, next) => {
        try {
            let data = await authSvc.transformUserRegister(req)
            const user = await authSvc.createUser(data)
            await authSvc.sendActivationNotification(data.name, data.otp, data.email)

            res.json({
                data: user,
                message: "User registered successfully",
                status: "USER_REGISTERED",
                options: null
            })

        } catch (exception) {
            console.log("Register", exception)

            next(exception)
        }
    }
    registerRider = async (req, res, next) => {
        try {
            let data = await authSvc.transformUserRegister(req)
            const user = await authSvc.createRider(data)
            await authSvc.sendActivationNotification(data.name, data.otp, data.email)

            res.json({
                data: user,
                message: "User registered successfully",
                status: "USER_REGISTERED",
                options: null
            })

        } catch (exception) {
            console.log("Register", exception)

            next(exception)
        }
    }

    activateUser = async (req, res, next) => {
        try {
            const data = req.body;
            const user = await authSvc.getSingleUserByFilter({ email: data.email });
            if (user.status === 'active') {
                throw {
                    code: 400, message: "User is already active", status: "USER_ALREADY_ACTIVE"
                }
            }
            let today = Date.now();
            let otpExpiryTime = user.otpExpiryTime.getTime();
            if (today > otpExpiryTime) {
                throw {
                    code: 422, message: "OTP expired", status: "OTP_EXPIRED"
                }
            }
            if (data.otp !== user.otp) {
                throw {
                    code: 403, message: "Invalid OTP", status: "INVALID_OTP"
                }
            }
            await authSvc.activateUser(user)
            res.json({
                data: null,
                message: "User activated successfully",
                status: "USER_ACTIVATED",
                options: null
            })
        }
        catch (exception) {
            console.log("Activate User", exception)
            next(exception)
        }


    }
    activateRider = async (req, res, next) => {
        try {
            const data = req.body;
            const user = await authSvc.getSingleRiderByFilter({ email: data.email });
            if (user.status === 'active') {
                throw {
                    code: 400, message: "User is already active", status: "USER_ALREADY_ACTIVE"
                }
            }
            let today = Date.now();
            let otpExpiryTime = user.otpExpiryTime.getTime();
            if (today > otpExpiryTime) {
                throw {
                    code: 422, message: "OTP expired", status: "OTP_EXPIRED"
                }
            }
            if (data.otp !== user.otp) {
                throw {
                    code: 403, message: "Invalid OTP", status: "INVALID_OTP"
                }
            }
            await authSvc.activateRider(user)
            res.json({
                data: null,
                message: "User activated successfully",
                status: "USER_ACTIVATED",
                options: null
            })
        }
        catch (exception) {
            console.log("Activate User", exception)
            next(exception)
        }


    }
    login = async (req, res, next) => {
        try {
            const data = req.body
            const user = await authSvc.getSingleUserByFilter({ email: data.email })
            if (user.status !== 'active') {
                throw { code: 401, message: "User is not active", status: "USER_NOT_ACTIVE" }
            }
            if (bcrypt.compareSync(data.password, user.password)) {
                let accessToken = jwt.sign({
                    sub: user._id,
                    typ: "bearer"
                },
                    process.env.JWT_SECRET, {
                    expiresIn: "1h"
                });
                let refreshToken = jwt.sign({
                    sub: user._id,
                    typ: "refresh"

                }, process.env.JWT_SECRET, {
                    expiresIn: "10d"
                });
                res.json({
                    detail: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: user.role,
                            location: user.location

                        }
                    },
                    message: "User logged in successfully",
                    status: "USER_LOGGED_IN",
                    options: null
                })
            } else {
                throw { code: 401, message: "Invalid credentials", status: "INVALID_CREDENTIALS" }
            }
        } catch (exception) {
            console.log("Login", exception)
            next(exception)
        }
    }
    loginRider = async (req, res, next) => {
        try {
            const data = req.body
            const user = await authSvc.getSingleRiderByFilter({ email: data.email })
            if (user.status !== 'active') {
                throw { code: 401, message: "User is not active", status: "USER_NOT_ACTIVE" }
            }
            if (bcrypt.compareSync(data.password, user.password)) {
                let accessToken = jwt.sign({
                    sub: user._id,
                    typ: "bearer"
                },
                    process.env.JWT_SECRET, {
                    expiresIn: "1h"
                });
                let refreshToken = jwt.sign({
                    sub: user._id,
                    typ: "refresh"

                }, process.env.JWT_SECRET, {
                    expiresIn: "10d"
                });
                res.json({
                    detail: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: user.role,
                            vehicle: user.vehicle,
                            location: user.location


                        }
                    },
                    message: "User logged in successfully",
                    status: "USER_LOGGED_IN",
                    options: null
                })
            } else {
                throw { code: 401, message: "Invalid credentials", status: "INVALID_CREDENTIALS" }
            }
        } catch (exception) {
            console.log("Login", exception)
            next(exception)
        }
    }
    getLoggedInUser = async (req, res, next) => {
        try {
            res.json({
                detail: req.authUser,
                message: "Your profile",
                status: "YOUR_PROFILE",
                options: null
            })

        }
        catch (exception) {
            console.log("Get Logged In User", exception)
            next(exception)
        }

    }

    updateLocation = async (req, res, next) => {
        try {
            console.log("🔹 Full Request Body:", req.body); // Logs everything in the request
            console.log("🔹 req.authUser:", req.authUser); // Check if authUser exists

            const userId = req.authUser.id
            const location = req.body.location
            console.log("Updating location for:", userId); // Debugging
            console.log("Received location:", location); // Debugging
            if (req.authUser.role === 'customer') {
                await authSvc.updateMyLocationUser(userId, location)
                res.json({
                    detail: req.authUser,
                    message: "Location updated successfully",
                    status: "LOCATION_UPDATED",
                    options: null

                })

            } else {
                await authSvc.updateMyLocation(userId, location)
                res.json({
                    detail: req.authUser,
                    message: "Location updated successfully",
                    status: "LOCATION_UPDATED",
                    options: null

                })

            }





        } catch (exception) {
            next(exception)
        }
    }


}
const authCtrl = new AuthController();
module.exports = authCtrl;
