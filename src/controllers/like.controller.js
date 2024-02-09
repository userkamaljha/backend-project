import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invaild video id!!")
    }

    let like;
    let message = "" ;
        like = await Like.findOneAndDelete({
        video: videoId,
        likedBy: req.user._id
    })
    message = "video unliked successfully!!"


    if(!like){
        like = await Like.create({
            video:videoId,
            likedBy: req.user._id
        })
        message = "video liked successfully!!"
    }


    if(!like){
        throw new ApiError(500, "Internal error while liking video!!")
    }

    return res.status(200).json(
        new ApiResponse(200, like , message)
    )
  

    
})

const toggleTweetLike = asyncHandler(async(req, res)=>{
    const {tweetId} = req.params

      if(!isValidObjectId(tweetId)){
        throw new  ApiError("Invaild Tweet id!!")
      }

      let like;
      let message = "";
    
      like = await Like.findOneAndDelete({ tweet:tweetId , likedBy: req.user._id})
      message = "Tweet unliked successfully!!"

      if(!like){
        like = await Like.create({ tweet: tweetId , likedBy: req.user._id})
        message = "Tweet liked suceessfully!!"
      }

      if(!like){
        throw new ApiError(500, "Internal error while liking tweet!!")
      }

      return res.status(200).json(
        new ApiResponse(200, like, message)
      )

})

const toggleCommentLike = asyncHandler(async(req, res)=>{
    const {commentId} = req.params

      if(!isValidObjectId(commentId)){
        throw new  ApiError("Invaild comment id!!")
      }

      let like;
      let message = "";
    
      like = await Like.findOneAndDelete({ comment:commentId , likedBy: req.user._id})
      message = "Tweet unliked successfully!!"

      if(!like){
        like = await Like.create({ comment: commentId , likedBy: req.user._id})
        message = "Tweet liked suceessfully!!"
      }

      if(!like){
        throw new ApiError(500, "Internal error while liking tweet!!")
      }

      return res.status(200).json(
        new ApiResponse(200, like, message)
      )

})

const getLikedVideos = asyncHandler(async(req, res)=>{
const likedVideos = await Like.aggregate([
   { $match: {likedBy:req.user?._id , video: {$exists: true}} },
   {$lookup :{from: "videos", localField:"video", foreignField: "_id", as: "videoDetails"}},
   {$unwind : "$videoDetails"},
   {$project: {
    _id:1,
    video:{
        _id: "$videoDetails._id",
        title: "$videoDetails.title",
        description: "$videoDetails.description",
        videoFile: "$videoDetails.videoFile",
        thumbnail: "$videoDetails.thumbnail",
        views: "$videoDetails.views",
        
        
    }
   } }
])

return res.status(200).json(
    new ApiResponse(200, likedVideos, "fetched all liked videos successfully!! ")
)


})

export {toggleVideoLike, toggleTweetLike, toggleCommentLike, getLikedVideos}