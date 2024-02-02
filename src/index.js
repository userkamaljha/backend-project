// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv'
import express from "express";
import connectDB from "./db/index.js";

let app = express()

dotenv.config({path:'./env'})


connectDB()

// 2nd way to connect db
// ;(async ()=>{
//     try {
//      await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
//      app.on('error', (error)=>{
//         console.log("error", error);
//         throw error
//      }) 
     
//      app.listen(process.env.PORT,()=>{
//         console.log(`app is lintening on ${process.env.PORT}`);
//      })
//     } catch (error) {
//         console.log('error', error);
//     }
// })()


function connectDb(){}

connectDb()