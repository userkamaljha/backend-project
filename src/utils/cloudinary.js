import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

let uploadOnCloudinary = async(localFilePath)=>{
   try {
     if(!localFilePath) return null
     // upload file on cloudinary
     let response =  await cloudinary.uploader.upload(localFilePath,{resource_type: 'auto'})
     //file has been uploaded succesful
     fs.unlinkSync(localFilePath)
     return response;
   } catch (error) {
      fs.unlinkSync(localFilePath) //remove locally saved file as the upload file failed
      return null 
   }
}

let deleteFromCloudinary = async(publicId)=>{
  try {
    if(!publicId) return null

    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto',
    })
  }catch(error){
    console.log("error while deleting file from cloudinary" , error);
  }
}


export {uploadOnCloudinary, deleteFromCloudinary}
