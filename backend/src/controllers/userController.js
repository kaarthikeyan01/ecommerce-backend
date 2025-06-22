import User from "../models/userModel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import uploadOnCloudinary from "../utils/cloudinary";
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async function (userId) {
    const user = await User.findById(userId)
    const refreshToken = await  user.generateRefreshToken(user)
    const accessToken = await user.generateAccessToken(user)
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })


    return { refreshToken , accessToken}
}

const registerUser = asyncHandler( async (req,res) => {
    const { username,email,password,address,phone} = req.body;
    const avatarFilePath = req.file

    if(!avatarFilePath){
        throw new ApiError(400,"avatar file is required")
    }

   const existedUser = await  User.findOne({
    $or:[
        {email : email},
        {username:username}
    ]
   })

   if(existedUser){
        throw new ApiError(409,"user already exist with similar email or username")
   }
    
   const avatar = await uploadOnCloudinary(avatarFilePath)

   const user = await User.create({
    username,
    email,
    password,
    address,
    phone,
    avatar:avatar.secure_url
   })
   
   const createdUser = await  User.findById(user._id).select("-password -tokens") 
   // email verification step to be done after registration
   // thats why i am not creating the token in reg process 
   //the user will login after the registartion process
                                                                            
   if(!craetedUser){
        throw new ApiError(404,"user not found")
   }

   res.status(201).json(
    new ApiResponse(200,createdUser,"registration completed ")
   )
} )

const loginUser = asyncHandler( async (req,res) => {
    const { email , password } = req.body

    const userData = await User.findOne({
        email
    })

    if(!userData){
        throw new ApiError(404,"user doesnt exist")
    }

    const comparePassword = userData.comparePassword(password)

    if(!comparePassword){
        throw new ApiError(401,"password is incorrect")
    }
    
    const { refreshToken , accessToken} =generateAccessTokenAndRefreshToken(userData._id)

    const user = await User.findById(userData._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,{ user,accessToken },"user loggedIn successfully")
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)                 // not required to clear accesstoken as it is not sent as cookie
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler( async (req,res) => {
    const refreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(!refreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    const decodedRefreshToken = await jwt.verify(refreshToken , process.env.REFRESH_TOKEN_KEY)

    if(!decodedRefreshToken){
        throw new ApiError(401,"refresh token not decoded")
    }

    const user = await User.findById(decodedRefreshToken._id)

    if(!user){
        throw new ApiError(400,"Invalid refresh token")
    }

    if(!refreshToken==user.refreshToken){
        throw new ApiError(401,"refresh token expired")
    }

    const { newRefreshToken , accessToken } = generateAccessTokenAndRefreshToken(user._id)
     const options = {
        httpOnly:true,
        secure:true
     }

     return res
     .status(200)
     .cookie("refreshToken",newRefreshToken,options)
     .cookie("accessToken",accessToken,options)
     .json(  new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            ))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateUserDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //remove the old file how?
    // there a public_id for the old prev img create a field in database and store that
    //after uploading the new file delete the old with public_id

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password -refereshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    refreshAccessToken
}