import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { createReview, deleteReview, getAllReviews, getSingleReview, updateReview } from "../controllers/reviewController.js";
import { validateReviewInput, validateReviewParams, validateUpdateAndDeleteReviewInput } from "../middleware/validationMiddleware.js";

const router=Router()

router.route('/').post(authenticateUser, validateReviewInput, createReview).get(getAllReviews)
router.route('/:id').get(validateReviewParams,getSingleReview).patch(authenticateUser,validateReviewParams, validateUpdateAndDeleteReviewInput, updateReview).delete(authenticateUser,validateReviewParams,validateUpdateAndDeleteReviewInput,deleteReview)

export default router