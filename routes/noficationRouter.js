import { Router } from "express";
import { getNotifications } from "../controllers/notificationController.js";
import { authorizePermissons } from "../middleware/authMiddleware.js";

const router=Router()

router.route('/').get(authorizePermissons,getNotifications)

export default router