import multer from 'multer';

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('-');
        const ext = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + ext);
    }
});


module.exports = multer({ storage: storage }).single("image");