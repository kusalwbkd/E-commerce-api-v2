import mongoose from "mongoose";
import Notification from "../models/Notification.js"
import { StatusCodes } from "http-status-codes";

export const getNotifications =async(req,res)=>{
    const userIdString = '664397dd5059a25a98080c1c';
   const userId =new mongoose.Types.ObjectId(userIdString);
    const notification=await Notification.findOne({to:userId})
    res.status(StatusCodes.OK).json({notification})
}