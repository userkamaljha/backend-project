import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



let createPlaylist = asyncHandler(async(req, res)=>{
 
    const {name, description} = req.body;

   if(!name || !description){
    throw new ApiError(400, "please provide name and description of playlist!")
   }

    const playlist = await Playlist.create({
        name: name,
        description: description,
        videos: [],
        owner: req.user._id,
    });

    console.log(playlist);
    
      return res
        .status(201).json(
        new ApiResponse(200, playlist, "Playlist create successfully!!"));
})

let getUserPlaylists = asyncHandler(async(req, res)=>{
    const {userId} = req.params
    
    if(!isValidObjectId(userId)){
        throw new ApiError(404, "Invaild user id!!")
    }

    const playlist = await Playlist.find({owner: userId})
    .populate("owner", " username , fullName , avatar");

    if(!playlist){
        throw new ApiError(404, "No user playlist Found!!")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "User Playlists Feteched Successfully!!")
    )
})

let updatePlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Invaild playlist id!")
    }
    if(!name || !description){
        throw new ApiError(400, "Please provide all fildes!")
    }

    let playlist = await Playlist.findByIdAndUpdate(playlistId, {
            $set: {
                name,
                description,
            }
        }, {new: true}
    );

    if(!playlist){
        throw new ApiError(404, "Playlist not found!!")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "playlist updated successfully!")
    )

})

let deletePlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Invaild Playlist id")
    }
  let playlist = await Playlist.findByIdAndDelete(playlistId);

  if(!playlist){
    throw new ApiError(404, "Playlist not found or already deleted!")
  }
return res.status(200).json(
    new ApiResponse(200 , playlist, "Playlist deleted successfully!!")
)
})

let getPlaylistById = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Invaild playlist id!!")
    }

    let playlist = await Playlist.findById(playlistId)
    // .populate("videos", { _id: 0 /* Define projection for videos */ })
    .populate("owner", "username fullname avatar");

    if(!playlist){
     throw new ApiResponse(404, "No Playlist found!!")
    }

   return res.status(200).json(
    new ApiResponse(200, playlist , "Playlist fetched by id successfully!!")
   )
})

let addVideoToPlaylist = asyncHandler(async(req, res)=>{
    const {playlistId, videoId} = req.params;
    const userId = req.user?._id;

    if(!isValidObjectId(playlistId || !isValidObjectId(videoId))){
        throw new ApiError(404, "Invaild Playlist or Video id!!")
    }

    let addVideo = await Playlist.findOneAndUpdate(
        {_id: playlistId, owner: userId },
        {$addToSet:{videos: videoId}},
        {new:true}
    );

    return res.status(200).json(
        new ApiResponse(200, addVideo, "video added to playlist succesfully!!")
    )
})

let removeVideoFromPlaylist = asyncHandler(async(req, res)=>{
    const {playlistId,videoId } = req.params;
    const userId = req.user?._id;

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(404, "Invaild Playlist or Video id!! ")
    }

    let removeVideo = await Playlist.findOneAndDelete(
        {id: playlistId, owner: userId},
        {$pull: {videos:videoId}},
        {new: true}
    );

    return res.status(200).json(
        new ApiResponse(200, removeVideo, "remove video form playlist successfully!!")
    )
})








export {createPlaylist, addVideoToPlaylist,getUserPlaylists, removeVideoFromPlaylist, updatePlaylist,  deletePlaylist, getPlaylistById}