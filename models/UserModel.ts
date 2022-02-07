import { Schema, model, Document } from 'mongoose'
import { ImageUploadModelInterface } from './ImageUploadModel';
// import mongooseUniqueValidator from 'mongoose-unique-validator';

export interface UserModelInterface {
    _id?: string;
    email: string;
    fullName: string;
    nickname: string;
    password: string;
    confirmHash: string;
    confirmed?: boolean;
    additionalInfo?: {
        location?: string;
        about?: string;
        website?: string;
    };
    images?: {
        profilePhoto?: null | ImageUploadModelInterface;
        backgroundPhoto?: null | ImageUploadModelInterface;
    };
    tweets?: string[];
    // image?:  null | ImageUploadModelInterface | Schema.Types.ObjectId; // Почему не работает
}

export interface UserUpdateInterface {
    
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
        nickname: {
            unique: true,
            required: true,
            type: String
        },
        additionalInfo: {
            location: {
                type: String
            },
            about: {
                type: String
            },
            website: {
                type: String
            },
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
        images: {
            profilePhoto: {
                type: Schema.Types.ObjectId,
                ref: 'ImageUpload',
                default: null
            },
            backgroundPhoto: {
                type: Schema.Types.ObjectId,
                ref: 'ImageUpload',
                default: null
            }
        }
    },
    { timestamps: true }                     //<--- Записывает в документ дату создания и дату обновления документа
)              //<--- Проверяет уникальность указанных значений и возвращает подробную ошибку (mongoDB просто возвращает код ошибки)

UserSchema.set('toJSON', {
    transform: function (_, obj) {
        delete obj.password;
        delete obj.confirmHash;
        return obj;
    },
});

export const UserModel = model('User', UserSchema)