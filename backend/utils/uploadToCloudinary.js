import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "havasta-hotels",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};

export default uploadToCloudinary;