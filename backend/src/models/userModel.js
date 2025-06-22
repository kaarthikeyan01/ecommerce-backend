const mongoose = require('mongoose');
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String }
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String, 
      default: '', // use cloudinary and fix a default url 
    },
    refreshToken: {
    type:String
  }
  },
  {
    timestamps: true 
  }
);

const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.method.comparePassword = async function (password) {
  return await bcrypt.compare(password,this.password)
}

userSchema.method.generateAccessToken= async function (user) {
  return await jwt.sign({
    _id:this._id,
    username:this.username,
    email:this.email,
  },process.env.ACCESS_TOKEN_KEY,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  })
}

userSchema.method.generateRefreshToken= async function (user) {
  return await jwt.sign({
    _id:this._id
  },process.env.ACCESS_REFRESH_KEY,{
    expiresIn:process.env.ACCESS_REFRESH_EXPIRY
  })
}


 export default User