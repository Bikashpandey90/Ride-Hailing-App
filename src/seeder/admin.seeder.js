const bcrypt = require('bcryptjs')
const UserModel = require('../modules/user.model')
const RiderModel = require('../modules/rider.model')

const adminUsers = [{
    name: "Bikash Pandey",
    email: "bikashpandey835+admin@gmail.com",
    role: "admin",
    password: bcrypt.hashSync("Admin123#"),
    status: "active"
}]

const populateAdmin = async () => {
    try {
        for (let user of adminUsers) {
            let existingUser = await UserModel.findOne({ email: user.email })
            // let existingRider = await RiderModel.findOne({ email: user.email })
            if (!existingUser) {
                let userObj = new UserModel(user)
                await userObj.save()
            }
            // if (!existingRider) {
            //     let userObj = new RiderModel(user)
            //     await userObj.save()
            // }
        }

    } catch (exception) {
        console.log("Populate Admin", exception)
        throw exception
    }
}
module.exports = populateAdmin