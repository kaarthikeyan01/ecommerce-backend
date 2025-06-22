import express from "express"
import AuthMiddleware from "../middlewares/AuthMiddleware"
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar, updateUserDetails } from "../controllers/userController"

const userRouter = express.Router()

userRouter.get("/user-details",AuthMiddleware,getCurrentUser)
userRouter.post("/register",uploadOnCloudinary.single('avatar'),registerUser)
userRouter.post("/login",AuthMiddleware,loginUser)
userRouter.delete("/logout",AuthMiddleware,logoutUser)
userRouter.patch("/update-details",AuthMiddleware,updateUserDetails)
userRouter.patch("/update-proflie",AuthMiddleware,updateUserAvatar)
userRouter.post("/refresh-accessToken",refreshAccessToken)

export default userRouter