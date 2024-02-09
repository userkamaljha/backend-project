import { Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js" 
import {addComment, removeComment, updateComment} from "../controllers/comment.controller.js"

let router = Router();

router.use(verifyJWT)

router.route("/:videoId").post(addComment)
router.route("/:commentId").delete(removeComment)
router.route("/:commentId").patch(updateComment)

export default router
