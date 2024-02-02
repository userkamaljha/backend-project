import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


let connectDB = async ()=>{
    try {
      let connectionInstance =   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`\n MongoDB connect!!! DB Host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('MONOGO DB CONNECTION ERROR::', error);
        process.exit(1)
    }

}

export default connectDB;