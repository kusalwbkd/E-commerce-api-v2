import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controllers/ProductController.js";
import { authenticateUser, authorizePermissons } from "../middleware/authMiddleware.js";
import { validateProductInput, validateProductParams, validateProductUpdateInput } from "../middleware/validationMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import { getSingleProductReview } from "../controllers/reviewController.js";

const router=Router()


router.route('/').post(authenticateUser,authorizePermissons,upload.single('image'), validateProductInput, createProduct).get(getAllProducts)

router.route('/:id').get(validateProductParams,getSingleProduct).patch(authenticateUser,authorizePermissons,validateProductParams,validateProductUpdateInput,upload.single('image'),updateProduct).delete(authenticateUser,authorizePermissons,validateProductParams,  deleteProduct)
router.route('/:id/reviews').get(validateProductParams,getSingleProductReview);


export default router;