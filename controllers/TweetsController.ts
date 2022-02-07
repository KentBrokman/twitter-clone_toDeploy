import express from 'express'
import { TweetImageInterface, TweetModel, TweetModelInterface } from './../models/TweetModel';
import { isValidObjectId } from '../utils/isValidObjectId';
import { validationResult } from 'express-validator';
import { UserModelInterface } from '../models/UserModel';
// import { Schema } from 'mongoose';
import { cloudinary } from '../core/cloudinary';
import streamifier from 'streamifier'
// import { mongoose } from '../core/db';
// import { pipeline } from 'stream'
// import { promisify } from 'util'

// let asyncPipeline = promisify(pipeline)

class TweetsController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find({}).populate({
                path: 'user',
                populate: { path: 'images.profilePhoto' }
            }).sort({ createdAt: '-1' }).exec()   // populate позволяет нам из id поля user получить документ User. И теперб в этом поле будет отображаться объект, а не просто id

            res.json({
                status: 201,
                data: tweets
            })
        } catch (e) {
            res.status(500).json({
                message: "Что-то пошло не так",
                error: e
            })
        }
    }

    async showOne(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweetId = req.params.id
            if (!isValidObjectId(tweetId)) {
                res.status(400).json({ message: 'Пользователь не найден' })
                return
            }

            const tweet = await TweetModel.findById(tweetId).populate({
                path: 'user',
                populate: { path: 'images.profilePhoto' }
            }).exec()
            if (tweet) {
                res.status(201).json({ message: 'success', data: tweet })
            } else {
                res.status(404).json({ message: 'Твит не найден' })
            }
        } catch (e) {
            res.status(500).json({ error: e, message: 'Вероятно неверный формат данных' })
        }
    }
    async showOwn(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id
            if (!isValidObjectId(userId)) {
                res.status(400).json({ message: 'Пользователь не найден' })
                return
            }

            const tweets = await TweetModel.find({ user: userId }).populate({
                path: 'user',
                populate: {path: 'images.profilePhoto images.backgroundPhoto'}
            }).sort({ createdAt: '-1' }).exec()

            if (tweets) {
                res.status(201).json({ message: 'success', data: tweets })
            } else {
                res.status(404).json({ message: 'Твит не найден' })
            }
        } catch (e) {
            res.status(500).json({ error: e, message: 'Вероятно неверный формат данных' })
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface          // При запросе создания твита мы будем использовать passport, который и закинет в req user а

            if (user._id) {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() })
                    return
                }

                let data: TweetModelInterface
                if (req.files?.length === 0) {
                    data = {
                        text: req.body.text,
                        user: user._id
                        // user: user._id as unknown as Schema.Types.ObjectId
                    }
                } else {
                    let imagesUploaded: TweetImageInterface[] = []
                    const imageFiles = req.files as unknown as Express.Multer.File[]
                    let uploadImage = (imageFile: Express.Multer.File) => {
                        return new Promise((resolve, reject) => {
                            const writeStream = cloudinary.uploader.upload_stream(
                                {
                                    folder: 'Twitter-clone_images/tweetImages'
                                },
                                (error, result) => {
                                    if (!error && req.user && result) {
                                        const imageData = {
                                            cloudinary_id: result.public_id,
                                            cloudinary_url: result.url
                                        }
                                        imagesUploaded.push(imageData)
                                        resolve('done')
                                    } else {
                                        res.status(500).json({
                                            status: 'error',
                                            error
                                        })
                                        reject('error')
                                    }
                                }
                            )
                            streamifier.createReadStream(imageFile.buffer).pipe(writeStream)
                        })
                    }
                    for (let imageFile of imageFiles) {
                        await uploadImage(imageFile)
                    }
                    data = {
                        text: req.body.text,
                        user: user._id,
                        // user: user._id as unknown as Schema.Types.ObjectId,
                        images: imagesUploaded
                    }
                }
                const tweet = await TweetModel.create(data)

                res.status(200).json({
                    data: await tweet.populate({
                        path: 'user',
                        populate: {path: 'images.profilePhoto'}
                    })
                })
            }
        } catch (e) {
            res.status(500).json({
                message: "Что-то пошло не так",
                error: e
            })
        }
    }

    async delete(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface
            if (user) {
                const tweetId = req.params.id
                if (!isValidObjectId(tweetId)) {
                    res.status(400).json({ message: 'Не валидный id твита' })
                    return
                }

                const tweet = await TweetModel.findById(tweetId)

                if (tweet) {
                    if (String(user._id) === String(tweet.user)) {
                        if (tweet.images && tweet.images.length) {
                            for (let image of tweet.images) {
                                await cloudinary.uploader.destroy(image.cloudinary_id)
                            }
                        }
                        await tweet.remove()

                        res.status(200).json({ message: 'Твит удален', tweet })
                    } else {
                        res.status(400).json({ message: 'Id пользователя не равен id твита' })
                    }
                } else {
                    res.status(400).json({ message: 'Нет такого твита' })
                }
            }
        } catch (e) {
            res.status(500).json({
                message: "Что-то пошло не так",
                error: e
            })
        }
    }

    async update(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface
            if (user) {
                const tweetId = req.params.id
                if (!isValidObjectId(tweetId)) {
                    res.status(400).json({ message: 'Не валидный id твита' })
                    return
                }

                const tweet = await TweetModel.findById(tweetId)

                if (tweet) {
                    if (String(user._id) === String(tweet.user)) {
                        tweet.text = req.body.text
                        await tweet.save()
                        res.status(200).json({ message: 'Твит обновлен', tweet })
                    } else {
                        res.status(403).json({ message: 'Id пользователя не равен id твита' })
                    }
                } else {
                    res.status(404).json({ message: 'Нет такого твита' })
                }
            }
        } catch (e) {
            res.status(500).json({
                message: "Что-то пошло не так",
                error: e
            })
        }
    }
}

export const TweetsCtrl = new TweetsController