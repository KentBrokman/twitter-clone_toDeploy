import express from 'express'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { UserModel, UserModelInterface, UserModelDocumentInterface} from '../models/UserModel'
import { generateMD5 } from '../utils/generateHash'
import { isValidObjectId } from '../utils/isValidObjectId'
import {sendEmail} from '../utils/sendEmail'

class UserController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec()

            res.json({
                status: 201,
                data: users
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
            const userId = req.params.id
            if(!isValidObjectId(userId)) {
                res.status(400).json({message: 'Пользователь не найден'})
                return
            }
            
            const user = await UserModel.findById(userId).exec()

            
            
            if (user) {
                res.status(201).json({message: 'success', data: user})
            } else {
                res.status(404).json({message: 'Пользователь не найден'})
            }
        } catch (e) {
            res.status(500).json({error: e, message: 'Вероятно неверный формат данных'})
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() })
                return
            }

            const randomStr = Math.random().toString();

            const data: UserModelInterface = {
                email: req.body.email,
                fullName: req.body.fullName,
                userName: req.body.userName,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(process.env.SECRET_KEY + randomStr || randomStr)
            }

            const user = await UserModel.create(data)

            sendEmail(
                {
                    from: "admin@twitter.com",
                    to: data.email,
                    subject: "Подтверждение почты Twitter-Clone Tutorial",
                    html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:${process.env.PORT}/auth/verify?hash=${data.confirmHash}">по этой ссылке</a>`,
                },
                function (err: Error | null) {
                    if (err) {
                        res.status(500).json({message: err})
                    } else {
                        res.status(200).json({ data: user })
                    }
                }
            );
        } catch (e) {
            res.status(500).json({message: e})
        }
    }

    async afterLogin(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = (req.user as UserModelDocumentInterface).toJSON()      // Используем UserModelDocumentInterface, чтобы привести req.user из паспорта в читаемый вид
            res.status(200).json({
                status: 'success',
                data: {
                    ...user,
                    token: jwt.sign({data: req.user}, process.env.SECRET_KEY as string, {expiresIn: "1d"})
                }
            })
        } catch (e) {
            res.status(500).json({message: e})
        }
    }

    async getUserInfo(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = (req.user as UserModelDocumentInterface).toJSON()      // Используем UserModelDocumentInterface, чтобы привести req.user из паспорта в читаемый вид
            res.status(200).json({
                status: 'success',
                data: user
            })
        } catch (e) {
            res.status(500).json({message: e})
        }
    }

    async verify(req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash
            if (!hash) {
                res.status(400).send()
                return
            }
            
            const user = await UserModel.findOne({ confirmHash: String(hash) }).exec()
            
            if (user) {
                user.confirmed = true
                await user.save()

                res.status(201).json({message: 'success', data: user})
            } else {
                res.status(404).json({message: 'Пользователь не найден'})
            }
        } catch (e) {
            res.status(500).json({message: e})
        }
    }
}

export const UserCtrl = new UserController()