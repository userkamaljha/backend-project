import { mongoose, isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";



const addComment = asyncHandler(async(req, res)=>{
    let {content} = req.body
    let {videoId} = req.params

    if(!isValidObjectId(videoId)){
      throw new ApiError(400, "Invaild video id!!")
    }
    if(!content || content === ""){
        throw new ApiError(400, "Please provide comment content!!")
    }

    const comment = new Comment({
      content,
      video: videoId,
      owner: req.user?._id
    })

    const createComment = await comment.save({vaildateBeforeSave: false});

    

    return res.status(200).json(
        new ApiResponse(200 , createComment, "Comment added to video successfully!!")
    )


})

const removeComment = asyncHandler(async(req, res)=>{
    let {commentId} = req.params

    if(!isValidObjectId(commentId)){
      throw new ApiError(400, "Invaild video id!!")
    }
    const comment = await Comment.findByIdAndDelete(commentId) ;

    if(!comment){
        throw new ApiError(404, "Comment not Found!!")
    }

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment remove from Video successfully!!")
    )

})

const updateComment = asyncHandler(async(req, res)=>{
    let {content} = req.body
    let {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400 , "Invaild comment id!!")
    }

    if(!content || content === "" ){
        throw new ApiError(404, "Please provide comment content!!")
    }

    const comment = await Comment.findByIdAndUpdate(commentId, {
        $set:{ content: content },
    }, {new: true})

    if(!comment){
        throw new ApiError(404, "Comment not found!!")
    }

    return res.status(200, comment, "Comment updated successfully!!")


})

const getVideoComment = asyncHandler(async(req, res)=>{
    let {videoId} = req.params
    const {page= 1, limit= 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invaild video id!!")
    }
 
    let comments = await Comment.aggregatePaginate([
        {$match: { video :new mongoose.Types.ObjectId(videoId) }},
        {$sort: { createdAt: -1 }},
        {$skip:(page -1 )* limit},
        {$limit: limit},
    ],{ page, limit })

    return res.status(200).json(
        new ApiResponse(200, comments, "fetched video comments successfully!! ")
    )


})

export {addComment, removeComment, updateComment, getVideoComment}