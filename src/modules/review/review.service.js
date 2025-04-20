const Review = require("./review.model");

class ReviewService {

    create = async (data) => {
        try {
            const reviewObj = new Review(data)
            return await reviewObj.save()

        } catch (exception) {
            console.log("Review Create Exceptioon : ", exception);
            throw exception
        }
    }

    countData = async (filter = {}) => {
        try {
            return await Review.countDocuments(filter)

        } catch (exception) {
            console.log("Count data excepttion : ", exception)
            throw exception
        }
    }
    listAllReview = async (filter) => {
        try {
            let data = await Review.find(filter)

            return data

        } catch (exception) {
            console.log("List all review excepttion : ", exception)
            throw exception
        }
    }
    getRiderReviewsByFilter = async (riderId) => {
        try {
            const filter={
                rider:riderId
            }
            const response = await Review.find(filter)
            return response

        } catch (exception) {
            console.log("Get Rider Reviews By Filter Exceptioon : ", exception);
            throw exception
        }
    }
    getSingleReviewByFilter = async (filter) => {
        try {
            const data = await Review.findOne(filter)
                .populate('createdBy', ["_id", "name", "email", "status"])
                .populate('updatedBy', ["_id", "name", "email", "status"])


            if (!data) {
                throw { code: 404, message: "Review not found", status: "NOT_FOUND" }


            }


            return data

        } catch (exception) {
            console.log("Get Single Review By Filter Exceptioon : ", exception);
            throw exception
        }
    }
    deleteByFilter = async (filter) => {
        try {
            const response = await Review.findOneAndDelete(filter)
            return response

        } catch (exception) {
            console.log("Delete By Filter Exceptioon : ", exception);
            throw exception

        }
    }
    updateByFilter = async (filter, updateData) => {
        try {
            const response = await Review.findOneAndUpdate(filter, { $set: updateData }, { new: true })
            return response

        } catch (exception) {
            console.log("Update By Filter Exceptioon : ", exception);
            throw exception
        }
    }


}
const reviewSvc = new ReviewService()
module.exports = reviewSvc