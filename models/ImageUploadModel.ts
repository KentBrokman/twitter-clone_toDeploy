import { Schema, model } from 'mongoose'

export interface ImageUploadModelInterface {
    _id?: string;
    cloudinary_id: string;
    cloudinary_url: string;
    // on: Schema.Types.ObjectId;
    // onModel: string;
}

const ImageUploadSchema = new Schema<ImageUploadModelInterface>(
    {
        cloudinary_id: {
            required: true,
            type: String
        },
        cloudinary_url: {
            required: true,
            type: String
        },
        // on: {
        //     required: true,
        //     refPath: 'onModel',
        //     type: Schema.Types.ObjectId
        // },
        // onModel: {
        //     type: String,
        //     required: true,
        //     enum: ['User', 'Tweet']
        // }
    },
    { timestamps: true }                                        //<--- Записывает в документ дату создания и дату обновления документа
)


export const ImageUploadModel = model('ImageUpload', ImageUploadSchema)