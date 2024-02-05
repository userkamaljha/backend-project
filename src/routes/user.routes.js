import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import  {upload} from '../middlewares/multer.middleware.js'
import { verfiyJWT } from "../middlewares/auth.middleware.js";

let router = Router();


router.route("/register").post(
     upload.fields([
     {
        name:"avatar",
        maxCount:1
     },
     {
     name:"coverImage",
     maxCount:1
     }
     ]), 
    registerUser)

    router.route("/login").post(loginUser)

    //secure routes

    router.route("/logout").post(verfiyJWT, logoutUser)


export default router