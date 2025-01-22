import { body, check, validationResult,param } from "express-validator";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../erros/customError.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { comparePassword } from "../utils/passwordUtils.js";
import Review from "../models/Review.js";


const withValidationErrors = (validateValues) => {
    return [
      validateValues,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessages = errors.array().map((error) => error.msg);
  
          const firstMessage = errorMessages[0];
          console.log(Object.getPrototypeOf(firstMessage));
          if (errorMessages[0].startsWith('no product')) {
            throw new NotFoundError(errorMessages);
          }
          if (errorMessages[0].startsWith('no user')) {
            throw new NotFoundError(errorMessages);
          }
          if (errorMessages[0].startsWith('not authorized')) {
            throw new UnauthorizedError('not authorized to access this route');
          }
          throw new BadRequestError(errorMessages);
        }
        next();
      },
    ];
  };


  //validate authenticATION
export const validateRegisterInput =withValidationErrors([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async(email)=>{
    const user=await User.findOne({email})
    if(user){
    throw new BadRequestError('email already exists')
    }
    }),
    body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long'),
  body('location').notEmpty().withMessage('location is required'),
  body('lastName').notEmpty().withMessage('last name is required'),
])

export const validateLoginInput=withValidationErrors([
  body('email').notEmpty().withMessage('Email is required')
  .isEmail().withMessage('email is not valid'),

  body('password').notEmpty().withMessage('password is required')

])

//validate users
export const validateUserParams=withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
    const user = await User.findById(value);
    if (!user) throw new NotFoundError(`no user with id ${value}`);
    
  }),
])

export const validateUpdateUserInput =withValidationErrors([
  body('name').optional(),
  body('email').optional()
  .isEmail()
  .withMessage('invalid email format')
  .custom(async(email,{req})=>{
  const user=await User.findOne({email})
 
    if(user && user._id.toString()!== req.user.userId ){
  throw new BadRequestError('email already exists')
    
  }
  }),
  body('oldPassword')
  .optional()
  .custom(async (oldPassword, { req }) => {
    const oldUser = await User.findById(req.user.userId).select('password');
    const isPasswordMatch = await comparePassword(oldPassword, oldUser.password);
    if (!isPasswordMatch) {
      throw new BadRequestError('Passwords do not match');
    }
  }),
  body('newpassword')
  .optional()
  .isLength({ min: 6 })
  .withMessage('password must be at least 6 characters long'),

body('location').optional(),
body('lastName').optional(),
])

export const validateUpdateUserPasswordInput =withValidationErrors([
 
  body('oldPassword')
  .notEmpty().withMessage('please provide your old password')
  .custom(async (oldPassword, { req }) => {
    const oldUser = await User.findById(req.user.userId);
    const isPasswordMatch = await comparePassword(oldPassword, oldUser.password);
    if (!isPasswordMatch) {
      throw new BadRequestError('Passwords do not match');
    }
  }),
  body('password')
  .notEmpty().withMessage('Please provide your new password')
  .isLength({ min: 6 })
  .withMessage('password must be at least 6 characters long'),


])
//validate products

export const validateProductInput=withValidationErrors([
  body('name').notEmpty().withMessage('Please provide product name').trim().isString()
  .isLength({ max: 100 })
  .withMessage('Name can not be more than 100 characters'),


  body('price').notEmpty().withMessage('please provide price').isNumeric().withMessage('please provide a numeric value'),
  

  body('description').notEmpty().withMessage('please provide product description').isString()
.isLength({max:1000}).withMessage('description can not be more than 1000 characters'),

body('category').notEmpty().withMessage('please insert a category').isIn(['smartphones','laptops','tabs','iphones','ipads']).withMessage('invalid category').isString(),
body('company').notEmpty().withMessage('please insert a company').isIn(['Samsung','Apple','Asus']).withMessage('invalid company').isString(),

body('inventory').optional().isNumeric().withMessage('inventory should be a number'),
body('averageRating').optional().isNumeric().withMessage('averageRating should be a number'),
body('numOfReviews').optional().isNumeric().withMessage('numOfReviews should be a number'),
 
])

export const validateProductParams=withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
    const product = await Product.findById(value);
    if (!product) throw new NotFoundError(`no product with id ${value}`);
    
  }),
])

export const validateProductUpdateInput=withValidationErrors([
  body('name').optional().trim()
  .isLength({ max: 100 })
  .withMessage('Name can not be more than 100 characters'),


  body('price').optional().isNumeric().withMessage('please provide a numeric value'),
  

  body('description').optional().isString()
.isLength({max:1000}).withMessage('description can not be more than 1000 characters'),

body('category').optional().isIn(['smartphones','laptops','tabs','iphones','ipads']).withMessage('invalid category').isString(),
body('company').optional().isIn(['Samsung','Apple','Asus']).withMessage('invalid company').isString(),

body('inventory').optional().isNumeric().withMessage('inventory should be a number'),
body('averageRating').optional().isNumeric().withMessage('averageRating should be a number'),
body('numOfReviews').optional().isNumeric().withMessage('numOfReviews should be a number'),
])


//validate reviews

export const validateReviewParams=withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
    const review = await Review.findById(value);
    if (!review) throw new NotFoundError(`no review with id ${value}`);
   
    
  }),
])

export const validateReviewInput=withValidationErrors([
  body('rating').notEmpty().withMessage('rating is required')
  .isNumeric().withMessage('This should be a number')
  .isLength({min:1,max:5}).withMessage('should be between 1 and 5')
  
  ,
  body('title').optional()
  
 .isLength({max:100}).withMessage('title should not exceed 100 characters')
 .trim(),

  body('comment')
  .notEmpty()
  .withMessage('please provide a review text'),

  body('product').notEmpty().withMessage('product is required').isMongoId().withMessage('invalid id type')
  .custom(async(product,{req})=>{
    const isValidProduct=await Product.findById(product)
    if(!isValidProduct){
    throw new NotFoundError(`no product with ${product}`)
    }

    const alreadySubmitted=await Review.findOne({
      product: product,
        user: req.user.userId,
    })

    if(alreadySubmitted){
      throw new BadRequestError('already submitted a review')
    }
  })

])

export const validateUpdateAndDeleteReviewInput=withValidationErrors([

  async(req,res,next)=>{
 const isAdmin=req.user.role ==='admin';
 const isReviewOwner=await Review.findOne({user:req.user.userId})
 if(!isAdmin && !isReviewOwner){
throw new UnauthorizedError('you are not authorized to alter this review')
 }
 next()
  },

  body('rating').optional()
  .isNumeric().withMessage('This should be a number')
  .isFloat({min:1,max:5}).withMessage('should be between 1 and 5')
  
  ,
  body('title').optional()
  
 .isLength({max:100}).withMessage('title should not exceed 100 characters')
 .trim(),

  body('comment')
  .optional()
  
  

])

//validate order
