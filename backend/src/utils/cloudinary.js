import { v2 as cloudinary } from 'cloudinary';



    // Configuration
cloudinary.config({ 
   cloud_name: 'darqgwll8', 
   api_key: '761778682168269', 
   api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });

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
    } catch (error) {
        
    }
}