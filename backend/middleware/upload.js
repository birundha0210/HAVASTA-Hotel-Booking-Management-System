import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        const filename = Date.now() + extension;

        cb(null, filename);
    }

});

const upload = multer({
    storage: storage
});

export default upload;