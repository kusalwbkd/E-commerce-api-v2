import { Router } from "express";
import { getNotifications } from "../controllers/notificationController.js";
import { authorizePermissons } from "../middleware/authMiddleware.js";
import { getSingleProductSale, getTotalSale } from "../controllers/salesController.js";

const router=Router()

router.route('/').get(authorizePermissons,getTotalSale)
router.route('/:id').get(authorizePermissons,getSingleProductSale)

export default router