import { UserModelDocumentInterface, UserModel } from './../models/UserModel';
import express from 'express';
// import fs from 'fs'
import streamifier from 'streamifier'
// import { Readable } from 'stream'
import { cloudinary } from '../core/cloudinary';
import { ImageUploadModel } from '../models/ImageUploadModel';



class UploadFileController {
    async uploadProfilePhoto(req: express.Request, res: express.Response) {
        try {
            const user = (req.user as UserModelDocumentInterface).toJSON()
            
            if (req.file) {
                let userDB = await UserModel.findOne({ email: user.email }).exec()
                if (!userDB) {
                    return res.status(400).json({ messsgae: 'нет такого пользователя' })
                }
                if (userDB && userDB.images && userDB.images.profilePhoto) {
                    let userDB_Populated = await userDB.populate('images.profilePhoto')
                    if (userDB_Populated && userDB_Populated.images && userDB_Populated.images.profilePhoto) {
                        await cloudinary.uploader.destroy(userDB_Populated.images.profilePhoto.cloudinary_id)
                        await ImageUploadModel.deleteOne({ _id: userDB_Populated.images.profilePhoto._id })
                    }
                }
                let writeStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Twitter-clone_images/images/profilePhotos'
                    },
                    async (error, result) => {
                        if (!error && req.user && result) {
                            const newProfilePhotoData = {
                                cloudinary_id: result.public_id,
                                cloudinary_url: result.url
                            }
                            const newProfilePhoto = await ImageUploadModel.create(newProfilePhotoData)
                            const uploadedImageUserData = await UserModel.updateOne({ email: user.email }, {
                                images: {
                                    profilePhoto: newProfilePhoto._id,
                                    backgroundPhoto: userDB?.images?.backgroundPhoto
                                }
                            })
                            res.status(200).json({
                                status: 'success',
                                data: uploadedImageUserData
                            })
                        } else {
                            res.status(500).json({
                                status: 'error',
                                error
                            })
                        }
                    });
                let readStream = streamifier.createReadStream(req.file.buffer)
                readStream.pipe(writeStream)
            }
        } catch (error) {
            res.status(400).json({
                message: 'blabal',
                error
            })
        }
    }
    async uploadBackgroundPhoto(req: express.Request, res: express.Response) {
        try {
            const user = (req.user as UserModelDocumentInterface).toJSON()
            
            if (req.file) {
                let userDB = await UserModel.findOne({ email: user.email }).exec()
                if (!userDB) {
                    return res.status(400).json({ messsgae: 'нет такого пользователя' })
                }
                if (userDB && userDB.images && userDB.images.backgroundPhoto) {
                    let userDB_Populated = await userDB.populate('images.backgroundPhoto')
                    if (userDB_Populated && userDB_Populated.images && userDB_Populated.images.backgroundPhoto) {
                        await cloudinary.uploader.destroy(userDB_Populated.images.backgroundPhoto.cloudinary_id)
                        await ImageUploadModel.deleteOne({ _id: userDB_Populated.images.backgroundPhoto._id })
                    }
                }
                let writeStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Twitter-clone_images/images/backgroundPhotos'
                    },
                    async (error, result) => {
                        if (!error && req.user && result) {
                            const newBackgroundPhotoData = {
                                cloudinary_id: result.public_id,
                                cloudinary_url: result.url
                            }
                            const newBackgroundPhoto = await ImageUploadModel.create(newBackgroundPhotoData)
                            const uploadedImageUserData = await UserModel.updateOne({ email: user.email }, {
                                images: {
                                    profilePhoto: userDB?.images?.profilePhoto,
                                    backgroundPhoto: newBackgroundPhoto._id
                                }
                            })
                            res.status(200).json({
                                status: 'success',
                                data: uploadedImageUserData
                            })
                        } else {
                            res.status(500).json({
                                status: 'error',
                                error
                            })
                        }
                    });
                let readStream = streamifier.createReadStream(req.file.buffer)
                readStream.pipe(writeStream)
            }
        } catch (error) {
            res.status(400).json({
                message: 'blabal',
                error
            })
        }
    }
}


export const UploadFileCtrl = new UploadFileController()