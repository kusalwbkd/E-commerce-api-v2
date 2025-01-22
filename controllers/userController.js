import { StatusCodes } from "http-status-codes"
import User from "../models/User.js"
import { checkPermissions } from "../utils/checkPermissions.js"
import { BadRequestError } from "../erros/customError.js"
import { hashPassword } from "../utils/passwordUtils.js"
import cloudinary from 'cloudinary';
import { formatImage } from "../middleware/multerMiddleware.js"

export const getAllUsers=async(req,res)=>{
    const users=await User.find({})
    const count=users.length
    res.status(StatusCodes.OK).json({users,count:count})
}

export const getSingleUser=async(req,res)=>{
    const user=await User.findById(req.params.id).populate('reviews').select("-password")
    res.status(StatusCodes.OK).json({user})
}

export const showMe=async(req,res)=>{
    const user=await User.findById(req.user.userId).select("-password").populate('reviews')
    res.status(StatusCodes.OK).json({user})
}

export const updateUser=async(req,res)=>{
    
      if(req.file){
        const file = formatImage(req.file);
        const response = await cloudinary.v2.uploader.upload(file);
        req.body.avatar = response.secure_url;
        req.body.avatarPublicId = response.public_id;
       }
       const user=await User.findOneAndUpdate({_id:req.user.userId},req.body,{
        new:true,
       
      })
       if (req.file && user.imagePublicId) {
        await cloudinary.v2.uploader.destroy(user.avatarPublicId);
      }

      res.status(StatusCodes.OK).json({msg:'User updated!!!'})
       
}

export const updateUserPassword=async(req,res)=>{
       

        const hashedPassword=await hashPassword(req.body.password)
     req.body.password=hashedPassword
        await User.findOneAndUpdate({_id:req.user.userId},req.body,{
            new:true,
           
          })
        res.status(StatusCodes.OK).json({msg:'Password changed !!!'})
    
     
}