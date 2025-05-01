const jwt = require("jsonwebtoken");
const authSvc = require("../auth/auth.service");


const checkLogin = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || null;
        if (!token) {
            throw { code: 401, message: "Token Required", status: "TOKEN_EXPECTED" }
        }
        token = token.split(' ').pop()
        const data = jwt.verify(token, process.env.JWT_SECRET)
        if (data.typ !== 'bearer') {
            throw { code: 403, message: "Invalid token ", status: "INVALID_TOKEN" }
        }
        const user = await authSvc.getSingleUserByFilter({ _id: data.sub })
        if (!user) {
            throw { code: 401, message: "User not found", status: "USER_NOT_FOUND" }
        }
        req.authUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            status: user.status,
            phone: user.phone,
            address: user.address,
            location: user.location
        }
        next()
    } catch (exception) {
        if (exception.name === 'TokenExpiredError') {
            return res.json({
                message: "Token Expired",
                status: "TOKEN_EXPIRED",
                options: null,
            })
            next({ code: 401, message: "Token Expired", status: "TOKEN_EXPIRED" })
        } else if (exception.name === 'JsonWebTokenWebError') {
            next({ code: 401, message: exception.message, status: "TOKEN_ERROR" })
        }
        next(exception)
    }
}
const checkLoginRider = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || null;
        if (!token) {
            throw { code: 401, message: "Token Required", status: "TOKEN_EXPECTED" }
        }
        token = token.split(' ').pop()
        const data = jwt.verify(token, process.env.JWT_SECRET)
        if (data.typ !== 'bearer') {
            throw { code: 403, message: "Invalid token ", status: "INVALID_TOKEN" }
        }
        const user = await authSvc.getSingleRiderByFilter({ _id: data.sub })
        if (!user) {
            throw { code: 401, message: "Rider not found", status: "RIDER_NOT_FOUND" }
        }
        req.authUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            status: user.status,
            phone: user.phone,
            address: user.address,
            vehicle: user.vehicle,
            location: user.location
        }
        next()
    } catch (exception) {
        if (exception.name === 'TokenExpiredError') {
            next({ code: 401, message: "Token Expired", status: "TOKEN_EXPIRED" })
        } else if (exception.name === 'JsonWebTokenWebError') {
            next({ code: 401, message: exception.message, status: "TOKEN_ERROR" })
        }
        next(exception)
    }
}
module.exports = {
    checkLogin,
    checkLoginRider
}