import { isValidObjectId } from "mongoose";
import {Video} from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllVideos = asyncHandler(async(req, res)=>{
    const {page = 1, limit= 10, query, sortBy, sortType, userId} = req.query

   let aggregationPipeline = [];

   //filters videos based on a case-insensitive regular expression match in the title field

   if(query){
    aggregationPipeline.push({
        $match:{
            title:{
                $regex: query,
                $options: "i"
            }
        }
    })
   }
   if(userId){
    aggregationPipeline.push({
        $match:{userId: userId},
    })
   }

   if(sortBy){
    aggregationPipeline.push({
        $sort:{[sortBy]: sortType}
    })
   }

    const videos = await Video.aggregatePaginate({
        pipeline: aggregationPipeline,
        page,
        limit,
    })
    return res.status(200).json(
        new ApiResponse(200, videos, "videos feteched successfully!!")
    )

})

const pusblishAVideo = asyncHandler(async(req, res)=>{
const {title, description} = req.body
const userId = req.user?._id

if ([title, description].some((field) => field.trim() === "")){
    throw new ApiError(404, "all fields are required!!");
}

let videoLocalPath = req.files?.videoFile[0]?.path
let thumbnailLocalPath = req.files?.thumbnail[0]?.path


if(!videoLocalPath){
    throw new ApiError(400, "Video is required!!")
}
if(!thumbnailLocalPath){
    throw new ApiError(400, "Thumbnail  is required!!")
}

const uploadVideoFile = await uploadOnCloudinary(videoLocalPath)
const uploadThumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)

if(!uploadVideoFile.url){
    throw new ApiError(400, 'Error while uploading Video file!!')
   }
if(!uploadThumbnailFile.url){
    throw new ApiError(400, 'Error while uploading Thumbnail file!!')
   }

   const video = await Video.create({
    videoFile: uploadVideoFile.secure_url,
    thumbnail: uploadThumbnailFile.secure_url,
    title,
    description,
    owner: userId,
    duration: uploadVideoFile.duration,
    views: 0
   })

   return res.status(200).json(
    new ApiResponse(200, video, "Video published successfully!!")
   )



})

const getVideoById = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invaild video id!!")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(400, "Video not Found!!")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video found successfully!!" )
    )

})

const getUserVideo = asyncHandler(async(req, res)=>{
    const {userId} = req.params 

    console.log(userId);

    if(!isValidObjectId(userId)){
     throw new ApiError(400, "Invaild user id!!")
    }

    const videos = await Video.find({owner: userId})
    .populate("owner", " username , fullName , avatar");

    if(!videos){
        throw new ApiError(404, "No User Video found!!")
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "User videos feteched successfully!!")
    )
})

const updateVideo = asyncHandler(async(req, res)=>{
   const {videoId} = req.params
   const {title, description} = req.body
   const thumbnail = req.file?.path;

   if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invaild video id!!")
   }

   if(!title || !description){
    throw new ApiError(400, "All Fields are Required!!")
   }

   let updatedThumbnailUrl;
   if(thumbnail){
    let  updatedThumbnailUrl = await uploadOnCloudinary(thumbnail);
    updatedThumbnailUrl = updatedThumbnailUrl.secure_url;

    const oldVideo = await Video.findById(videoId);
    if(oldVideo.thumbnail){
        await deleteFromCloudinary(oldVideo.thumbnail);
    }
   }
   
   let video = await Video.findByIdAndUpdate(videoId, {
    $set:{
        title,
        description,
        thumbnail: updatedThumbnailUrl,
    },
   },{new : true})


   return res.status(200).json(
    new ApiResponse (200, video, "Video updated successfully!!")
   )





})

const deleteVideo = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiResponse(400, "Invaild video id!!")
    }

    let video = await Video.findByIdAndDelete(videoId);

    if(!video){
        throw new ApiError(404, "Video not found!!")
    }

    if (video.thumbnail) {
        await deleteFromCloudinary(video.thumbnail);
      }
  
      if (video.videoFile) {
        await deleteFromCloudinary(video.videoFile);
      }
    
    return res.status(200).json(
        new ApiResponse(200, video, "Video deleted successfully!!")
    )

})

const togglePublishStatus = asyncHandler(async(req, res)=>{
    let {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invaild video id!!")
    }

    const video = await Video.findById(videoId);
    if(!videoId){
        throw new ApiError(404, "Video not found!!")
    }

    video.isPublished = !video.isPublished;
    await video.save({validateBeforeSave: false});

    return res.status(200).json(
        new ApiResponse(200, video, "video publish status changed successfully!!")
    )

})

export {pusblishAVideo, getVideoById, getUserVideo, updateVideo, deleteVideo, togglePublishStatus, getAllVideos}