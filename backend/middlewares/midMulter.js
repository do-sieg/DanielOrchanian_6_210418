import path from 'path';
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
        const base = path.basename(name, '.' + ext);
        callback(null, Date.now() + "_" + base + '.' + ext);
    }
});


module.exports = multer({ storage: storage }).single("image");