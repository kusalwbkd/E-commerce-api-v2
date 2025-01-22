import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { UnauthenticatedError } from "../erros/customError.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { createJwt } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
    const isFirstAccount=(await User.countDocuments())===0
    req.body.role=isFirstAccount?'admin':'user'
    const hashedPassword=await hashPassword(req.body.password)
    req.body.password=hashedPassword
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({msg:'user created!'})
  };


  export const login = async (req, res) => {

    const user=await User.findOne({email:req.body.email})

    const isPasswordCorrect=await comparePassword(req.body.password,user.password)
    
    const validUser=user && isPasswordCorrect

    if(!validUser){
throw new UnauthenticatedError('invalid credentials')
    }
    const token=createJwt({ userId: user._id, role: user.role})
    const oneDay = 1000 * 60 * 60 * 24;

res.cookie('token', token, {
  httpOnly: true,
  expires: new Date(Date.now() + oneDay),
  secure: process.env.NODE_ENV === 'production',
});
user.password=null

    res.status(StatusCodes.OK).json({msg:'user logged in!',token,user})
    
   
  };
  export const logout = (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
  };