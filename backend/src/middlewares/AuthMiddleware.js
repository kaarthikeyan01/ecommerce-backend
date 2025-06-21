import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError";
import User from "../models/userModel";

const AuthMiddleware = asyncHandler( (req,res,next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if(!token){
        throw new ApiError(401,"user not authorised")
    }

    const decodedUser = jwt.verify(token,process.env.ACCESS_TOKEN_KEY)

    const user = User.findById(decodedUser?._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(401,"access token not found")
    }

    req.user=user
    next()
})

export default AuthMiddleware