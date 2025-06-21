import User from "../models/userModel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

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

   const existedUser = await  User.findOne({
    $or:[
        {email : email},
        {username:username}
    ]
   })

   if(existedUser){
        throw new ApiError(409,"user already exist with similar email or username")
   }
    
   const user = await User.create({
    username,
    email,
    password,
    address,
    phone
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

