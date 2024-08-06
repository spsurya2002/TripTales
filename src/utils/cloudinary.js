import {v2 as  cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath)return null
        //upload file
       const resopnse = await cloudinary.uploader.upload(localFilePath, {
         resource_type:"auto"
        })
        //file has been uploaded successfully
        // console.log("file is uploaded on cloudinary",resopnse.url);
        fs.unlinkSync(localFilePath);
        console.log("Cloudinarr response: ",resopnse);
        return resopnse;
    } catch (error) {
        fs.unlinkSync(localFilePath)//reomve the locally saved temp file
        console.log(" This error is from clodinary.js ",error)
        return null
        
    }
}

const deleteFromCloudinary = async(publicId, resource_type = "image") => {
    try {
      if(!publicId) return null;
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: `${resource_type}`
      })
      return result
    } catch (error) {
      console.log("Error while deleting file on cloudinary", error);
      return error
    }
  
  }
  



  export { uploadOnCloudinary, deleteFromCloudinary };