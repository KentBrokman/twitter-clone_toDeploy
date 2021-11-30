import express from 'express';



class UploadFileController {
    async upload(req: express.Request) {
        console.log(req.file)
    }
}


export const UploadFileCtrl = new UploadFileController()