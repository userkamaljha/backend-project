import { aysncHandler } from "../utils/asyncHandler.js"; 

let registerUser  = aysncHandler(async (req , res)=>{
    res.status(200).json({
        message: 'ok'
    })
})


export {registerUser}