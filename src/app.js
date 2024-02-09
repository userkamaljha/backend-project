import express  from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

let app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))

app.use(cookieParser())


// routes import

import userRouter from './routes/user.routes.js';
import playlistRouter from "./routes/playlist.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRouter from "./routes/likes.routes.js";
import CommentRouter from "./routes/comments.routes.js";

///routes delcartion
app.use("/api/v1/users", userRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/comments", CommentRouter)


 
export {app};