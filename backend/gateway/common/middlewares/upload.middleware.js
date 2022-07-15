//File upload with multer
const multer = require('multer');

//Determine the file size limit
let fileSizeLimit;

/**
 * @function (01) define variable destination
 *           (02) define dynamic file name
 */
const storage = multer.diskStorage({
    //01
    destination: function (req, file, cb) {
        cb(null, `./${req.body.filePath}/`)
    },
    /*
    destination: (req, file, cb) => { // setting destination of uploading files
        if (file.fieldname === "resume") { // if uploading resume
            cb(null, 'resumes');
        } else { // else uploading image
            cb(null, 'images');
        }
    },
     */
    //02 todo: make name equal to user id to find it everywhere again - use the param from the req, on logo use the enterprise id
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}_${file.originalname}`)
    }
})

/**
 * @function (01) based on file ident offer different upload possibilities
 *           (02) check if mime type of file corresponds to allowed extensions
 */
const fileFilter = (req, file, cb) => {
    //01
    let fileRestriction;
    switch (req.body.fileType) {
        case 'file':
            fileRestriction = ['image/jpeg', 'application/pdf', 'image/jpeg'];
            fileSizeLimit = 100000000; // = 100mb
            break;
        case 'img':
            fileRestriction = ['image/jpeg', 'image/png', 'image/svg+xml']
            fileSizeLimit = 5000000; // = 5mb
            break;
        case 'video':
            fileRestriction = ['video/mp4', 'video/ogg', 'video/quicktime', 'audio/mp4']
            fileSizeLimit = 1000000000 // = 1GB
            break;
        case 'sound':
            fileRestriction = ['audio/ogg', 'audio/mpeg', 'audio/wav']
            fileSizeLimit = 5000000; // = 5mb
            break;
    }
    //02
    fileRestriction.includes(file.mimetype) === true ? cb(null, true) : cb(null, false);
}

/**
 * @function (01) export the final multer instance
 */
exports.upload = multer({
    //01
    storage: storage,
    limits: {
        fileSize: fileSizeLimit
    },
    fileFilter: fileFilter
})

