import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  location: {
    type: String,
    default: 'my city',
  },
    avatar:{
      type: String,
    },
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
},{toJSON:{virtuals:true},toObject:{virtuals:true}});

UserSchema.virtual('reviews',{
  ref:'Review',
  localField:'_id',
  foreignField:'user',
  justOne:false
})

export default mongoose.model('User', UserSchema);