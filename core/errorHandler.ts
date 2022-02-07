import { Response } from 'express';
import multer from "multer";




export const errorHandler = (err: Error, _: any, res: Response, __: any) => {
    if (err instanceof multer.MulterError) {
        res.status(418).json({ message: 'multer error', error: err });
    } else {
        res.status(500).json({ message: 'unhandled error', error: err })
    }
}