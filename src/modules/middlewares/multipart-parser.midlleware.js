const multer = require('multer');
const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = "./public/"
        cb(null, path)

    },
    filename: (req, file, cb) => {
        let filename = file.originalname;
        cb(null, filename)

    }
})

const uploader = (type = 'image') => {
    let allowed = []

    if (type === 'image') {
        allowed = ['jpeg', 'png', 'jpg', 'svg', 'webp', 'gif', 'bmp']
    } else if (type === 'doc') {
        allowed = ['pdf', 'docx', 'doc', 'txt', 'zip', 'rar', 'exe', 'ppt', 'csv']
    }

    return multer({
        storage: myStorage,
        fileFilter: (req, file, cb) => {
            let ext = file.originalname.split('.').pop()

            if (allowed.includes(ext)) {
                cb(null, true)
            } else {
                cb({
                    code: 400, message: "File format not supported", status: "INVALID_FILE_FORMAT", detail: {
                        [file.fieldname]: "File format not supported"
                    }
                })
            }
        }, limits: {
            fileSize: 1024 * 1024 * 5
        }

    })

}

module.exports = uploader