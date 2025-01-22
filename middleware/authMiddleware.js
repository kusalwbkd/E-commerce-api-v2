import { UnauthenticatedError, UnauthorizedError } from "../erros/customError.js";
import User from "../models/User.js";
import { verifyJWt } from "../utils/tokenUtils.js";


export const authenticateUser = async (req, res, next) => {


  const { token } = req.cookies;
 
  
  if (!token) {
    throw new UnauthenticatedError('authentication invalid');
  }

 
  try {
     const { userId, role } = verifyJWt(token);
    req.user = { userId, role };
   
   
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};

export const authorizePermissons=async(req,res,next)=>{
  const isAdmin=req.user.role==='admin'
  
 if(isAdmin){
  next()
 }
 else{
  throw new UnauthorizedError('you are not authorized!!!')
 }

}
