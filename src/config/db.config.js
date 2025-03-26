const mongoose = require('mongoose');
const populateAdmin = require('../seeder/admin.seeder');

require("dotenv").config();


const dbConnect = async () => {
    try {

        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: process.env.MONGODB_DB,
            autoCreate: true,
            autoIndex: true

        });
        console.log("Admin table seeding started...")
        await populateAdmin()
        console.log("Admin table seeding completed...")
        console.log("Database server connected successfully.............");

    } catch (exception) {
        console.log("Database connection failed", exception);
        // process.exit()
    }
}
dbConnect();