import { ApiError } from "../utils/ApiError.js";
import { aysncHandler } from "../utils/asyncHandler.js";
import jwt from'json-web-token';
import { User } from "../models/user.model.js";

 
export const verfiyJWT = aysncHandler(async(req, _ , next)=>{
try {
    const token =req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer ', "")
    
    if(!token){
    throw new ApiError(401, "Unauthorized Request!")
    }
    
    const decodedToken =  jwt.verfiy(token, process.env.ACCESS_TOKEN_SECRET)
    
    let user = await User.findById(decodedToken?._id).select('-password -refreshToken')
    
    if(!user){
        throw new ApiError(401, 'Invalid Access Token')
    }
    req.user = user;
    next()
} catch (error) {
    throw ApiError(401,error?.message || 'Invalid Access Token')
}
})