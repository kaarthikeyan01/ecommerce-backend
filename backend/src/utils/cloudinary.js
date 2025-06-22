import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

import { ApiError } from './ApiError';

    // Configuration
cloudinary.config({ 
   cloud_name: 'darqgwll8', 
   api_key: '761778682168269', 
   api_secret: '<your_api_secret>'
    });
import { ApiError } from './ApiError';

const uploadOnCloudinary =async (localFilePath) => {
    try {
       if(!localFilePath) return null
       //uploading file with filePath
       const uploadResult = await cloudinary.uploader
       .upload(
           localFilePath, {
               resource_type: "auto"//detects file type
           }
       )

       fs.unlinkSync(localFilePath)//remove the file from the disk after uploadind to cloudinary
    } catch (error) {
        if(fs.existsSync(localFilePath)){   // check for file existing in disk and remove if it exist
            fs.unlinkSync(localFilePath)    // it is not safe to keep the file in ur disk
        }

        throw new ApiError(404,"file not uploaded")
    }
}

export default uploadOnCloudinary