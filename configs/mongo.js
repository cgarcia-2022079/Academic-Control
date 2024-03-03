'Use strict'

import mongoose, {Mongoose} from 'mongoose'
export const connect = async()=>{
    try {
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | could not be connect to mongodb')
            mongoose.disconnect()
        })

        mongoose.connection.on('connecting', ()=> console.log('MongoDB | try connecting'))
        mongoose.connection.on('connected', ()=> console.log('MongoDB | connected to mongodb'))
        mongoose.connection.on('open', ()=> console.log('MongoDB | connected to database'))
        mongoose.connection.on('disconnected', ()=> console.log('MongoDB | disconnected'))
        mongoose.connection.on('reconnected', ()=> console.log('MongoDB | reconnected to mongoDB'))

        await mongoose.connect('mongodb://localhost:27017/EducationalCenter');
        console.log('Connected to database')
    } catch (error) {
        console.log('Database connection failed', error)
    }
}