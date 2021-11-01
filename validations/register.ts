import { body } from 'express-validator'


export const registerValidations = [
    body('email')
        .isEmail().withMessage('Неверный формат email')
        .isLength({ min: 10, max: 40 }).withMessage('Неверная длина почты. Допустимые значения от 10 до 40'),
    body('fullName')
        .isString().withMessage('Неверный формат имени')
        .isLength({ min: 2, max: 40 }).withMessage('Неверная длина имени. Допустимые значения от 2 до 40'),
    body('userName')
        .isString().withMessage('Неверный формат логина')
        .isLength({ min: 2, max: 40 }).withMessage('Неверная длина логина. Допустимые значения от 2 до 40'),
    body('password')
        .isString().withMessage('Неверный формат пароля')
        .isLength({ min: 6 }).withMessage('Минимальная длина пароля 6 символов')
        .custom((value, {req}) => {
            if (value !== req.body.password2) {
                throw new Error('Пароли не совпадают')
            } else {
                return value
            }
        })
]