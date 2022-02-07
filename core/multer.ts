
// import express from 'express';
import multer, { FileFilterCallback } from 'multer';



const storage = multer.memoryStorage()
const multerFilter = (_: any, file: Express.Multer.File, cb: FileFilterCallback) => {     // Express - это глобальный интерфейс библиотеки @types/multer
    if (file.mimetype.split('/')[1] === 'jpeg' || file.mimetype.split('/')[1] === 'png') {
        cb(null, true)
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Not a png or jpeg file!"))
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1000 * 1000
    },
    fileFilter: multerFilter
})

// export const uploadAvatar = (req: express.Request, res: express.Response) => {
//     upload.single('avatarImage')(req, res, function (err) {
//         res.status(400).json({ message: 'error33', err })
//         // if (err instanceof multer.MulterError) {
//         //     res.status(400).json({ message: 'error33', err })
//         //     // Случилась ошибка Multer при загрузке.
//         // } else {
//         //     res.status(400).json({ message: 'unknown err', err })
//         //     // При загрузке произошла неизвестная ошибка.
//         // }
//     })
// }

export const uploadProfilePhoto = upload.single('profilePhoto')
export const uploadBackgroundPhoto = upload.single('backgroundPhoto')
export const uloadImageWithTweet = upload.array('tweetImage')

