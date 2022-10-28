const multer = require("multer");

const uploadImage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './licenseImages')
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '--' + file.originalname);
    }
})

module.exports.upload = multer({ storage: uploadImage })


