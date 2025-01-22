import mongoose from "mongoose";

const ReviewSchema=new mongoose.Schema({
    rating: {
        type: Number,
      
      },
      title: {
        type: String,
        trim: true,
       
      },
      comment: {
        type: String,
      
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      
      },
},
{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}}

)
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating=async function(productId){
 const result=await this.aggregate([
  {$match:{product:productId}},
  {$group:{
    _id:null,
    averageRating:{
      $avg: '$rating'
    },
    numOfReviews: {
      $sum: 1
    }
  }}
 ])
 console.log(result)
 try {
  await this.model('Product').findOneAndUpdate(
    { _id: productId },
    {
      averageRating: Math.ceil(result[0]?.averageRating || 0),
      numOfReviews: result[0]?.numOfReviews || 0,
    }
  );
} catch (error) {
  console.log(error);
}
}


ReviewSchema.post('save',async function(){
await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('findOneAndDelete',async function(doc){
  if (doc) {
    await this.model.calculateAverageRating(doc.product);
  }
  })
export default mongoose.model("Review",ReviewSchema)

/* import { MongoClient } from 'mongodb';
import {
  ObjectId
} from 'mongodb';



const agg = [
  {
    '$match': {
      'product': new ObjectId('6651c4ae3de85237bd807f96')
    }
  }, {
    '$group': {
      '_id': null, 
      'averageRating': {
        '$avg': '$rating'
      }, 
      'numOfReviews': {
        '$sum': 1
      }
    }
  }
];

const client = await MongoClient.connect(
  ''
);
const coll = client.db('ecommerce-admin').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close(); */