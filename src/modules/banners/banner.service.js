const fileUploaderSvc = require("../../services/fileuploader.service")
const BannerModel = require("./banner.model")

class BannerService {

    transformCreateRequest = async (req) => {
        try {
            let data = req.body
            if (!req.file) {
                throw { code: 400, detail: { image: "Image is required" }, message: "Validation Failed", status: "VALIDATION_FAILED" }

            } else {
                data.image = await fileUploaderSvc.uploadFile(req.file.path, '/banner')
            }
            data.createdBy = req.authUser.id
            return data

        } catch (exception) {
            throw exception
        }
    }
    transformUpdateRequest = async (req, bannerData) => {
        try {
            let data = req.body
            if (req.file) {
                data.image = await fileUploaderSvc.uploadFile(req.file.path, '/banner')

            } else {
                data.image = bannerData.image

            }
            data.updatedBy = req.authUser._id
            return data

        } catch (exception) {
            console.log("transformUpdateRequest", exception);
            throw exception
        }
    }
    createBanner = async (data) => {
        try {
            const bannerObj = new BannerModel(data)
            return await bannerObj.save()
        } catch (exception) {
            console.log("Create Banner", exception)
            throw exception
        }
    }
    countData = async (filter = {}) => {
        try {
            return await BannerModel.countDocuments(filter)

        } catch (exception) {
            console.log("Count Data", exception)
            throw exception
        }
    }

    listAllBanner = async ({ skip = 0, limit = 10, filter = {} }) => {
        try {
            let data = await BannerModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ _id: 1 })

            return data

        } catch (exception) {
            console.log("List All Banner", exception)
            throw exception
        }

    }
    getSingleByFilter = async (filter) => {
        try {
            const data = await BannerModel.findOne(filter)
                .populate('createdBy', ["_id", "name", "email", "status"])
                .populate('updatedBy', ["_id", "name", "email", "status"])
            if (!data) {
                throw { code: 404, message: "Banner not found", status: "NOT_FOUND" }
            }

            return data

        } catch (exception) {
            console.log("Get Single By Filter", exception)
            throw exception
        }
    }
    deleteByFilter = async (filter) => {
        try {
            const response = await BannerModel.findOneAndDelete(filter)
            return response

        } catch (exception) {
            console.log("Delete By Filter", exception)
            throw exception
        }
    }
    updateByFilter = async (filter, updateData) => {
        try {
            const resp = await BannerModel.findOneAndUpdate(filter, { $set: updateData })
            return resp

        } catch (exception) {
            console.log("Update By Filter", exception)
            throw exception
        }
    }

}
const bannerSvc = new BannerService()
module.exports = bannerSvc