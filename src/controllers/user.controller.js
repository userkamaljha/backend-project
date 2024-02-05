import { aysncHandler } from "../utils/asyncHandler.js"; 
import {ApiError} from "../utils/ApiError.js"
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


let generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken =user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
      throw new ApiError(500, 'something went wrong, while creating access and refresh token') 
    }
}

let registerUser  = aysncHandler(async (req , res)=>{

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password} = req.body

    if([fullName, email ,username , password].some((field)=> field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are required")
    }
   
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or user with username already exists")
    }

    // console.log(req.files);

    let avatarLocalPath = req.files?.avatar[0]?.path;
    let coverLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
     throw new ApiError(400 , "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)
    

    if(!avatar){
        throw new ApiError(400 , 'Avatar file is required')
    }

   const user = await  User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, 'user registered successfully!')
    )

})

let loginUser = aysncHandler(async(req, res)=>{
   // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie 

    let {email, username, password} = req.body
    if(!username || !email){
        throw new ApiError(400, 'username or email is required')
    }
    let user = await User.findOne({
        $or:[{username}, {email}]
    })
    if(!user){
        throw new ApiError(400, 'User does not exist!!' )
    }

    let isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, 'Invaild password credentials')
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    let loggedInUser =  await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return  res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
             {
                 user:loggedInUser, accessToken,refreshToken
             },
             'User Loggedin Successfully!!'
                 
        )
    )



})

let logoutUser = aysncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
          new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out "))
})


export {registerUser, loginUser,logoutUser}


 