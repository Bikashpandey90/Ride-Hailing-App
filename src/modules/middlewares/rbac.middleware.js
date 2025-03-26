const allowedRoles = (role) => {
    return async (req, res, next) => {
        try {
            let loggedInUserRole = req.authUser.role
            if (!loggedInUserRole) {
                throw { code: 403, message: "Unauthorized", status: "ROLE_NOT_ASSIGNED" }
            }
            if ((typeof role === 'string' && loggedInUserRole === role) ||
                (Array.isArray(role) && role.includes(loggedinUserRole))
            ) {
                next()
            } else {
                throw {
                    code: 403, message: "Unauthorized", status: "PERMISSION_DENIED"
                }
            }
        } catch (exception) {
            next(exception)

        }
    }
}
module.exports = {
    allowedRoles
}