import { Router } from "express";
import {  authorizePermissons } from "../middleware/authMiddleware.js";
import { createOrder, getAllOrders, getCurrentUserOrders, getSingleOrder, updateOrder } from "../controllers/OrderController.js";

const router=Router()

router.route('/').post(createOrder).get(authorizePermissons,getAllOrders)
router.route('/showAllMyOrders').get(getCurrentUserOrders)
router.route('/:id').get(authorizePermissons,getSingleOrder).patch(authorizePermissons,updateOrder)

export default router
