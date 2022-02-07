import {v2 as cloudinary} from 'cloudinary'

// import { CloudinaryStorage } from "multer-storage-cloudinary"

if (!process.env.CLOUDINARY_NAME) {
    throw new Error('Отсутствуют конфигурации для Cloudinary')
}

// @ts-ignore
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         // @ts-ignore
//         folder: 'Twitter-clone_images'
//     },
// });

export { cloudinary }