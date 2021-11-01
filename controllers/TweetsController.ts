import express from 'express'
import { TweetModel, TweetModelInterface } from './../models/TweetModel';
import { isValidObjectId } from '../utils/isValidObjectId';
import { validationResult } from 'express-validator';
import { UserModelInterface } from '../models/UserModel';
import { Schema } from 'mongoose';



class TweetsController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find({}).populate('user').sort({createdAt: '-1'}).exec()   // populate позволяет нам из id поля user получить документ User. И теперб в этом поле будет отображаться объект, а не просто id

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

    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweetId = req.params.id
            if(!isValidObjectId(tweetId)) {
                res.status(400).json({message: 'Пользователь не найден'})
                return
            }
            
            const tweet = await TweetModel.findById(tweetId).populate('user').exec()

            if (tweet) {
                res.status(201).json({message: 'success', data: tweet})
            } else {
                res.status(404).json({message: 'Твит не найден'})
            }
        } catch (e) {
            res.status(500).json({error: e, message: 'Вероятно неверный формат данных'})
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelInterface                       // При запросе создания твита мы будем использовать passport, который и закинет в req user а
            
            if (user._id) {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    res.status(400).json({errors: errors.array()})
                    return
                }

                const data: TweetModelInterface = {
                    text: req.body.text,
                    user: user._id as unknown as Schema.Types.ObjectId
                }

                const tweet = await TweetModel.create(data)

                res.status(200).json({
                    data: await tweet.populate('user')
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
                if(!isValidObjectId(tweetId)) {
                    res.status(400).json({message: 'Не валидный id твита'})
                    return
                }

                const tweet = await TweetModel.findById(tweetId)

                if (tweet) {
                    if (String(user._id) === String(tweet.user)) {
                        tweet.remove()

                        res.status(200).json({message: 'Твит удален', tweet})
                    } else {
                        res.status(400).json({message: 'Id пользователя не равен id твита'})
                    }
                } else {
                    res.status(400).json({message: 'Нет такого твита'})
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
                if(!isValidObjectId(tweetId)) {
                    res.status(400).json({message: 'Не валидный id твита'})
                    return
                }

                const tweet = await TweetModel.findById(tweetId)

                if (tweet) {
                    if (String(user._id) === String(tweet.user)) {
                        tweet.text = req.body.text
                        await tweet.save()
                        res.status(200).json({message: 'Твит обновлен', tweet})
                    } else {
                        res.status(403).json({message: 'Id пользователя не равен id твита'})
                    }
                } else {
                    res.status(404).json({message: 'Нет такого твита'})
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