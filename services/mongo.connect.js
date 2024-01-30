import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000
}

export function connectDB () {
    return new Promise((resolve, reject) => {
        const mongoURL = process.env.MONGO_URL
        mongoose.connect(mongoURL, mongoOptions).then(conn => {
            console.log('database connected');
            resolve(conn)
        }).catch(err => {
            console.log('error during mongo connection', err);
            reject(err)
        })
    })
}