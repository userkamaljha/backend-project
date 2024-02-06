import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async(req, res , next)=>{
   try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log(req.cookies);
    if(!token){
     throw new ApiError(401, "unauthorizated ruquest")
    }
 
     let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
    const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
 
    if(!user){
     throw new ApiError(401, "Invail Access Token")
    }
    req.user = user;
    next();
   } catch (error) {
    throw new ApiError(401,error?.message || 'Invalid Access Token')
     }
})
 
// export const verfiyJWT = asyncHandler(async(req, _ , next)=>{
//     const token = req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer ', "")
//     console.log('TOKEN', token);
    
//     try {

    
//     if(!token){
//     throw new ApiError(401, "Unauthorized Request!")
//     }
    
//     let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
//     let user = await User.findById(decodedToken?._id).select('-password -refreshToken')
    
//     if(!user){
//         throw new ApiError(401, 'Invalid Access Token')
//     }
//     req.user = user;
//     next()
// } catch (error) {
//     throw new ApiError(401,error?.message || 'Invalid Access Token')
// }
// })