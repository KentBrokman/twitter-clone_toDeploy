import { body } from 'express-validator'


export const createTweetValidations = [
    body('text')
        .isString()
        .isLength({ max: 200 }).withMessage('Максимальная длина твита 200 символов')
]