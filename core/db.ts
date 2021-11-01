import mongoose from 'mongoose'


const mongoUri ='mongodb+srv://kentAdmin:kentAdminPass@cluster0.i11o5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(mongoUri)

export {mongoose}