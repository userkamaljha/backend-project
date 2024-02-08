import { Tweet } from "../models/tweet.models.js";
import { mongoose, isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

let createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content === "") {
    throw new ApiError(400, "Please provide content!!");
  }
  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, tweet, "tweet create succesfully!!"));
});

let getUserTweets = asyncHandler(async(req, res)=>{
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(404, "Invaild user id!");
    }

    let tweets = await Tweet.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
      ],
    )

    if(!tweets){
      throw new ApiError(404, "No user Tweets found!!")
    }
    

    return res.status(200)
    .json(new ApiResponse(200, tweets, "fetched all tweets created by user succesfully!! "))



});

let updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;


  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  if (!content.trim() === "") {
    throw new ApiError(400, "Please provide content!!");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet update succesfully!!"));
});

let deleteTweet = asyncHandler(async(req, res)=>{
    const { tweetId } = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invaild tweet id!")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if(!tweet){
        throw new ApiError(400, "Tweet not found or already deleted!")
    }

    return res.status(200)
    .json(new ApiResponse(200, tweet, "Tweet delete succesfully!"))
});



export { createTweet, getUserTweets, updateTweet, deleteTweet};
