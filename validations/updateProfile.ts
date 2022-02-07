import { body } from 'express-validator'


export const updateProfileValidations = [
    body('fullName')
        .isString().withMessage('Неверный формат имени')
        .isLength({ min: 0, max: 50 }).withMessage('Неверная длина имени. Допустимые значения от 0 до 50'),
    body('about')
        .isString().withMessage('Неверный формат about')
        .isLength({ min: 0, max: 160 }).withMessage('Неверная длина about. Допустимые значения от 0 до 160'),
    body('location')
        .isString().withMessage('Неверный формат location')
        .isLength({ min: 0, max: 30 }).withMessage('Неверная длина location. Допустимые значения от 0 до 30'),
    body('website')
        .isEmail().withMessage('Неверный формат website')
        .isLength({ min: 0, max: 100 }).withMessage('Неверная длина website. Допустимые значения от 0 до 100'),
]