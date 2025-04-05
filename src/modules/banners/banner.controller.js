const bannerSvc = require("./banner.service")

class BannerController {
    create = async (req, res, next) => {
        try {
            const data = await bannerSvc.transformCreateRequest(req)
            const banner = await bannerSvc.createBanner(data)

            res.json({
                data: banner,
                message: "Banner created successfully",
                status: "BANNER_CREATED",
                options: null
            })



        } catch (exception) {
            next(exception)
        }
    }

    index = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;
            let filter = {}
            if (req.query.search) {
                filter.$or = [
                    { title: new RegExp(req.query.search, 'i') },
                    { status: new RegExp(req.query.search, 'i') }
                ]
            }
            let data = await bannerSvc.listAllBanner({ skip, limit, filter })
            const totalCount = await bannerSvc.countData(filter)
            res.json({
                detail: data,
                message: "Banner list",
                status: "BANNER_LIST",
                options: {
                    currentPage: page,
                    limit: limit,
                    totalCount: totalCount
                }
            })


        } catch (exception) {
            next(exception)
        }

    }
    detail = async (req, res, next) => {
        try {
            const id = req.params.id
            const data = await bannerSvc.getSingleByFilter({
                _id: id
            })
            res.json({
                detail: data,
                message: "Banner detail",
                status: "BANNER_DETAIL",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }

    delete = async (req, res, next) => {
        try {
            const data = await bannerSvc.getSingleByFilter({
                _id: req.params.id
            })
            if (!data) {
                return res.status(400).json({
                    message: "Ride not found",
                    status: "INVALID_RIDE_ID"
                })
            }
            const response = await bannerSvc.deleteByFilter({
                _id: req.params.id
            })
            res.json({
                detail: response,
                message: "Banner deleted successfully",
                status: "BANNER_DELETED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    update = async (req, res, next) => {
        try {

            const data = await bannerSvc.getSingleByFilter({
                _id: req.params.id
            })
            const transformData = await bannerSvc.transformUpdateRequest(req, data)
            const response = await bannerSvc.updateByFilter({
                _id: req.params.id
            }, transformData)

            res.json({
                detail: response,
                message: "Banner updated successfully",
                status: "BANNER_UPDATED",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }
    getForHome = async (req, res, next) => {
        try {
            let filter = {
                $and: [{ status: 'active' },
                { startDate: { $lte: new Date() } },
                { endDate: { $gte: new Date() } },
                ]
            }
            const listBanner = await bannerSvc.listAllBanner({
                filter: filter,
                skip: 0,
                limit: 10

            })
            res.json({
                detail: listBanner,
                message: "List banner for home page",
                status: "BANNER_LIST_HOME",
                options: null
            })

        } catch (exception) {
            next(exception)
        }
    }

}
const bannerCtrl = new BannerController()
module.exports = bannerCtrl