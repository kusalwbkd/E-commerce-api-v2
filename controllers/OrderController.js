
import Product from "../models/Product.js";
import { BadRequestError, NotFoundError } from "../erros/customError.js";
import Order from "../models/Order.js";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import Sale from "../models/Sales.js";



export const createOrder =async(req,res)=>{
    
    
   const{cartItems,totalShippingCost:shippingFee,tax}=req.body
  
   const userIdString = '664397dd5059a25a98080c1c';
   const userId =new mongoose.Types.ObjectId(userIdString);
    if(!cartItems || cartItems.length <1){
    throw new BadRequestError('No cart item provided')
    }

    if(!tax){
        throw new BadRequestError('please provide tax  fee')
    }

    let orderItems=[]

    let subtotal=0

    for(const item of cartItems){
      const dbProduct=await Product.findById(item.productID)
      if(!dbProduct){
         throw new NotFoundError(`No product with ${item.product}`)
      }
      dbProduct.inventory -=item.amount
      if(dbProduct.inventory === 0){
        const newNotification = new Notification({
          type: "outofStock",
          from: req.user.userId,
          to:userId,
          message:`The item ${dbProduct.name} is Out of Stock....`
          
      });
      await newNotification.save()

      }
      await dbProduct.save()
      const{name,price,image,_id}=dbProduct
     const singleProductItem={
        amount:item.amount,
        name,
        price,
        image,
        product:_id
     }
orderItems=[...orderItems,singleProductItem]

subtotal +=item.amount*price

  const sale=new Sale({
    sales_item:_id,
    numOfItems:item.amount,
    total:price*item.amount
  })

  await sale.save()

    }

    const total=subtotal+shippingFee+tax
   
    
     const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        
        user: req.user.userId,
      }); 
    
      const newNotification = new Notification({
        type: "order",
        from: req.user.userId,
        to:userId,
        message:'New order has been placed'
        
    });

    await newNotification.save();
     res.status(StatusCodes.OK).json({msg:'order placed',order})
}
export const getAllOrders =async(req,res)=>{
   const orders=await Order.find({})
   res.status(StatusCodes.OK).json({orders})
}

export const getSingleOrder =async(req,res)=>{
    const{id:orderId}=req.params

    const order=await Order.findById(orderId).populate("user")
    if(!order){
    throw new NotFoundError(`No order with ${orderId}`)
    }
    res.status(StatusCodes.OK).json({order})
}

export const updateOrder =async(req,res)=>{
    const{status}=req.body
    const{id:orderId}=req.params

    const order=await Order.findById({_id:orderId})
    if(!order){
    throw new NotFoundError(`No order with ${orderId}`)
    }
    order.status=status;
    order.save()
    res.status(StatusCodes.OK).json({msg:'order updated!!!!'})
}


export const getCurrentUserOrders=async(req,res)=>{
 
  const page=Number(req.query.page)||1
const limit=Number(req.query.limit)||5
const skip=(page-1)*limit 
const orders=await Order.find({user:req.user.userId}).populate("user").skip(skip).limit(limit)
 
   
const totalOrders=await Order.countDocuments({user:req.user.userId})

const numOfPages=Math.ceil(totalOrders/limit)

  res.status(StatusCodes.OK).json({orders,totalOrders,numOfPages,currentPage:page})
}