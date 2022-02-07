import { Schema, model } from 'mongoose'

export interface TweetImageInterface {
    cloudinary_id: string,
    cloudinary_url: string
}

export interface TweetModelInterface {
    _id?: string;
    text: string;
    user: string;
    // user: Schema.Types.ObjectId;
    images?: TweetImageInterface[] | []
}

const TweetSchema = new Schema<TweetModelInterface>(
    {
        text: {
            required: true,
            type: String
        },
        user: {
            required: true,
            ref: 'User',                                        //<--- Ссылка на пользователя с указанным ObjectId     
            type: String             
            // type: Schema.Types.ObjectId
        },
        images: {
            type: [{
                cloudinary_id: String,
                cloudinary_url: String
            }],
            default: []
        }
    },
    { timestamps: true }                                        //<--- Записывает в документ дату создания и дату обновления документа
)


export const TweetModel = model('Tweet', TweetSchema)