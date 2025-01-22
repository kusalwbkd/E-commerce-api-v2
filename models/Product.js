import mongoose from "mongoose";

const ProductSchema=new mongoose.Schema({
    name: {
        type: String,
        trim: true,
     
      },
      price: {
        type: Number,
       
      },
      description: {
        type: String,
       
      },
      image: {
        type: String,
        default: '/uploads/example.jpeg',
      },
      category: {
        type: String,
       
        enum: ['smartphones','laptops','tabs','iphones','ipads'],
      },
      company: {
        type: String,
       
        enum: {
          values: ['Samsung','Apple','Asus'],
         
        },
      },
      colors: {
        type: [String],
        default: ['#222'],
        required: true,
      },
      featured: {
        type: Boolean,
        default: false,
      },
      freeShipping: {
        type: Boolean,
        default: false,
      },
      inventory: {
        type: Number,
       
        default: 15,
      },
      averageRating: {
        type: Number,
        default: 0,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
       
      },
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})


ProductSchema.virtual('reviews',{
  ref:'Review',
  localField:'_id',
  foreignField:'product',
  justOne:false
})



export default mongoose.model("Product",ProductSchema)