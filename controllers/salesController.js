import { StatusCodes } from "http-status-codes";
import Order from "../models/Order.js";
import Sale from "../models/Sales.js";
import { NotFoundError } from "../erros/customError.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getTotalSale=async(req,res)=>{
    const salesSum = await Sale.aggregate([
        {
            $group: {
                _id: null,
                totalSubtotal: { $sum: "$total" }
            }
        }
    ]);
    const totalSubtotal = salesSum.length > 0 ? salesSum[0].totalSubtotal : 0;
    const totalOrders=await Order.countDocuments({})
const itemsSum=await Sale.aggregate([
    {
        $group:{
            _id: null,
            totalItems: { $sum: "$numOfItems" }
        }
    }
])

const totalItems = itemsSum.length > 0 ? itemsSum[0].totalItems : 0;
   


    res.status(StatusCodes.OK).json({totalSubtotal,totalOrders,totalItems})
}

export const getSingleProductSale=async(req,res)=>{
    const productId=req.params.id 

    const product=await Sale.find({sales_item:productId}).populate("sales_item")
    const inventory=product[0].sales_item.inventory
  
    if(!product){
        throw new NotFoundError(`No item with productid ${productId}`)
    }
    const numOfSales=product.length

  const salesSum = await Sale.aggregate([
        {
            $match: {
                sales_item: new mongoose.Types.ObjectId(productId) 
               
            }
        },
        {
            $group: {
                _id: null,
                totalSubtotal: { $sum: "$total" }
            }
        }
    ]);

    const singleItemSalesSum= salesSum.length > 0 ? salesSum[0].totalSubtotal : 0;
    res.status(StatusCodes.OK).json({numOfSales,singleItemSalesSum,inventory})
}