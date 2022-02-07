
import passport from 'passport'
import { generateMD5 } from './../utils/generateHash';
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { UserModel, UserModelInterface } from '../models/UserModel'
import { Error } from 'mongoose';


passport.use(
    new LocalStrategy(
        async (username, password, done): Promise<void> => {                        //<--- passport ожидает объект именно с такими свойствами (username, password). Но их можно поменять, передав в LocalStratagy первым аргументоп объект с другими названиями полей
            try {
                const user = await UserModel.findOne({ $or: [{ email: username }, { nickname: username }] }).populate('images.profilePhoto images.backgroundPhoto').exec()

                if (!user) {
                    return done(null, false)
                }

                if (user.confirmed && user.password === generateMD5(password + process.env.SECRET_KEY)) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (err) {
                done(err, false)
            }
        }
    )
);

passport.use(
    new JwtStrategy(
        {
            secretOrKey: process.env.SECRET_KEY,                   // <--- Проверяет подлинность jwt
            jwtFromRequest: ExtractJwt.fromHeader('token')
        },
        async (payload: {data: UserModelInterface['_id']}, done): Promise<void> => {
            try {
                const user = await UserModel.findById(payload.data).populate('images.profilePhoto images.backgroundPhoto').exec()                

                if (!user) {
                    return done(null, false)
                }
                done(null, user)
            } catch (error) {
                done(error, false)
            }
        }
    )
)

// Сериализация - мы достаем из объекта пользователя id и отправляем его в сессию.
// При повторном запросе будет происходить десериализация - будет браться id из сессии,
// по нему будет искаться объект в бд и возвращаться клиенту

passport.serializeUser((user: any, done) => {               //<--- Добавить юзеру тип
    done(null, user?._id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: Error, user: UserModelInterface) => {
        done(err, user);
    });
});


export { passport }