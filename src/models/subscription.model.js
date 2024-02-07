import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId, //one who Subscriber
        ref: 'User'
    },
    channel:{
        type:Schema.Types.ObjectId, //one to whom "subscriber is Subscribing"
        ref: 'User'
    }
},{timestamps:true})


export const Subscription  = mongoose.model('Subscription', subscriptionSchema)