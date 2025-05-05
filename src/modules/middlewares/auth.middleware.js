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
            return res.json({
                message: "Token Expired",
                status: "TOKEN_EXPIRED",
                options: null,
            })

        } else if (exception.name === 'JsonWebTokenWebError') {
            next({ code: 401, message: exception.message, status: "TOKEN_ERROR" })

            return res.json({
                message: exception.message,
                status: "TOKEN_ERROR"

            })
        }
        next(exception)
    }

}
// const checkLoginEither = async (req, res, next) => {
//     let called = false

//     const nextOnce = (err) => {
//         if (!called) {
//             called = true
//             err ? next(err) : next()
//         }
//     }

//     // Try both middlewares
//     try {
//         await checkLogin(req, res, nextOnce)
//     } catch (e) {
//         console.log(e)
//     }

//     try {
//         await checkLoginRider(req, res, nextOnce)
//     } catch (e) {
//         console.log(e)
//     }

//     if (!called) {
//         res.status(401).json({ message: 'Unauthorized' })
//     }
// }
const checkLoginEither = async (req, res, next) => {
    const promisifyMiddleware = (middleware) => {
        return new Promise((resolve, reject) => {
            middleware(req, res, (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    };

    try {
        await promisifyMiddleware(checkLogin);
        return next(); // If checkLogin succeeded, we're done.
    } catch (e) {
        // CheckLogin failed — proceed to try checkLoginRider
    }

    try {
        await promisifyMiddleware(checkLoginRider);
        return next(); // If checkLoginRider succeeded, we're done.
    } catch (e) {
        // Both failed
    }

    return res.status(401).json({ message: 'Unauthorized' });
};
module.exports = {
    checkLogin,
    checkLoginRider,
    checkLoginEither
}