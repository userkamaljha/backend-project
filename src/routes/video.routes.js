import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getUserVideo, getVideoById, pusblishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";



let router = Router();

router.use(verifyJWT)


router.route("/").post(
    upload.fields([
    {name:"videoFile", maxCount: 1},
    { name: "thumbnail", maxCount: 1},   
]),pusblishAVideo).get(getAllVideos)

router.route("/:videoId").get(getVideoById);

router.route("/user/:userId").get(getUserVideo);

router.route("/:videoId").patch(upload.single("thumbnail"), updateVideo);

router.route("/:videoId").delete(deleteVideo);
router.route("/publish/:videoId").patch(togglePublishStatus);

export default router
