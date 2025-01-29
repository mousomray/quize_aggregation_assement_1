const multer = require('multer'); // Import multer
const path = require('path'); // Import path module 
const fs = require('fs'); // Import File System module

const FILE_TYPE = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
    'image/heif': 'heif',
    'image/heic': 'heic',
    'image/avif': 'avif'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isvaliddFile = FILE_TYPE[file.mimetype];
        const uploadError = new Error('File type not supported');
        if (isvaliddFile) {
            cb(null, 'uploads')
        } else {
            cb(uploadError, 'uploads')
        }
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadImage = multer({ storage: storage });


module.exports = uploadImage;

// After submitting Image Image will be store in uploads folder