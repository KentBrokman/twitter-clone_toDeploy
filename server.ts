import dotenv from 'dotenv'    
dotenv.config()     // loads environment variables from a .env file into process.env


import './core/db'    // Запускает указанный модуль, ничего не импортирует. (в нашем случае запускает подключение к базе данных)

import express from 'express';
import path from 'path'
// import express from 'express'
import { uloadImageWithTweet, uploadProfilePhoto, uploadBackgroundPhoto } from './core/multer'


import { passport } from './core/passport'

import { UserCtrl } from './controllers/UserController'
import { registerValidations } from './validations/register'
import { TweetsCtrl } from './controllers/TweetsController'
import { createTweetValidations } from './validations/createTweet'
import { UploadFileCtrl } from './controllers/UploadFileController'
import { errorHandler } from './core/errorHandler';
import { updateProfileValidations } from './validations/updateProfile';
// import { socket } from './socket/socket';



const app = express()

app.use(express.json())                       // < --- Читает json в js
app.use(passport.initialize())
app.use('/', express.static(path.join(__dirname, 'client', 'build')))



app.get('/users', UserCtrl.index)
app.get('/users/me', passport.authenticate('jwt', {session: false}), UserCtrl.getUserInfo)
app.get('/users/:id', UserCtrl.show)
app.put('/user', passport.authenticate('jwt'), updateProfileValidations, UserCtrl.update)

app.get('/tweets', TweetsCtrl.index)
app.get('/tweet/:id', TweetsCtrl.showOne)
app.get('/tweets/:id', TweetsCtrl.showOwn)
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetsCtrl.delete)
app.patch('/tweets/:id', passport.authenticate('jwt'), createTweetValidations, TweetsCtrl.update)
app.post('/tweets', passport.authenticate('jwt'), uloadImageWithTweet, createTweetValidations, TweetsCtrl.create)

app.get('/auth/verify', registerValidations, UserCtrl.verify)
app.post('/auth/register', registerValidations, UserCtrl.create)
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin)
// app.patch('/users', UserCtrl.update)
// app.delete('/users', UserCtrl.delete)

app.post('/uploadProfilePhoto', passport.authenticate('jwt'), uploadProfilePhoto, UploadFileCtrl.uploadProfilePhoto)
app.post('/uploadBackgroundPhoto', passport.authenticate('jwt'), uploadBackgroundPhoto, UploadFileCtrl.uploadBackgroundPhoto)

app.use(errorHandler)

app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

const PORT = process.env.PORT

app.listen(PORT, (): void => {
  console.log(`Server has been started at ${PORT} port`)
})