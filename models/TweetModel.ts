import { Schema, model } from 'mongoose'

export interface TweetModelInterface {
    _id?: string;
    text: string;
    user: Schema.Types.ObjectId;
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
            type: Schema.Types.ObjectId
        }
    },
    { timestamps: true }                                        //<--- Записывает в документ дату создания и дату обновления документа
)


export const TweetModel = model('Tweet', TweetSchema)