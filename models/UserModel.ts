import { Schema, model, Document } from 'mongoose'

export interface UserModelInterface {
    _id?: string;
    email: string;
    fullName: string;
    userName: string;
    password: string;
    confirmHash: string;
    confirmed?: boolean;
    location?: string;
    about?: string;
    website?: string;
    tweets?: string[];
}

export type UserModelDocumentInterface = UserModelInterface & Document


const UserSchema = new Schema<UserModelInterface>(
    {
        email: {
            unique: true,
            required: true,
            type: String
        },
        fullName: {
            required: true,
            type: String
        },
        userName: {
            unique: true,
            required: true,
            type: String
        },
        location: {
            type: String
        },
        password: {
            required: true,
            type: String
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        confirmHash: {
            required: true,
            type: String
        },
        about: String,
        website: String
    },
    { timestamps: true }                     //<--- Записывает в документ дату создания и дату обновления документа
)

UserSchema.set('toJSON', {
    transform: function (_, obj) {
        delete obj.password;
        delete obj.confirmHash;
        return obj;
    },
});

export const UserModel = model('User', UserSchema)