const rideSvc = require("../ride/ride.service");
const reviewSvc = require("./review.service");

class ReviewController {
    createReview = async (req, res, next) => {
        try {
            const data = {
                ...req.body,
                user: req.authUser.id
            }
            const rideDetail = await rideSvc.getSingleRideByFilter(req.body.rideId)
            if (!(rideDetail.status === 'completed')) {
                return res.status(400).json({
                    message: "Ride must be completed to add review",
                    status: "INVALID_RIDE_STATUS"

                })
            }
            if (!rideDetail) {
                return res.status(400).json({
                    message: "Ride not found",
                    status: "INVALID_RIDE_ID"
                })
            }
            const review = await reviewSvc.create(data)

            res.json({
                data: review,
                message: 'Review created successfully',
                status: "REVIEW_CREATE_SUCCESS",
                options: null


            })



        } catch (exception) {
            next(exception);
        }
    }
    getRiderReviews = async (req, res, next) => {
        try {



            const riderId = req.body.riderId

            const reviews = await reviewSvc.getRiderReviewsByFilter(riderId)
            const sumOfReviews = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageReview = reviews.length > 0 ? sumOfReviews / reviews.length : 0;
            res.json({
                data: reviews,
                averageReview: averageReview,
                message: 'Reviews fetched successfully',
                status: "REVIEW_FETCH_SUCCESS",
                options: null
            })

        } catch (exception) {
            next(exception);
        }
    }
    detail = async (req, res, next) => {
        try {
            const id = req.params.id
            const data = await reviewSvc.getSingleReviewByFilter({
                _id: id
            })

            res.json({
                detail: data,
                message: "Review Detail",
                status: "REVIEW_DETAIL",
                options: null

            })

        } catch (exception) {
            next(exception);
        }
    }
    delete = async (req, res, next) => {
        try {
            const data = await reviewSvc.getSingleReviewByFilter({
                _id: req.params.id
            })
            if (!data) {
                res.json({
                    message: "Review not found",
                    status: "REVIEW_NOT_FOUND",
                    options: null
                })
            }
            const response = await reviewSvc.deleteByFilter({
                _id: req.params.id
            })

            res.json({
                detail: response,
                message: "Review deleted successfully",
                status: "REVIEW_DELETED",
                options: null


            })

        } catch (exception) {
            next(exception);
        }
    }
    update = async (req, res, next) => {
        try {
            const data = await reviewSvc.getSingleReviewByFilter({
                _id: req.params.id
            })
            if (!data) {
                res.json({
                    message: "Review not found",
                    status: "REVIEW_NOT_FOUND",
                    options: null
                })

            }

            const response = await reviewSvc.updateByFilter({
                _id: req.params.id,

            }, req.body)
            res.json({
                detail: response,
                message: "Review updated successfully",
                status: "REVIEW_UPDATED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }

}
const reviewCtrl = new ReviewController()
module.exports = reviewCtrl