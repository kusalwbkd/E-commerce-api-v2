import { Router } from "express";
import { authenticateUser, authorizePermissons } from "../middleware/authMiddleware.js";
import { getAllUsers, getSingleUser, showMe, updateUser, updateUserPassword } from "../controllers/userController.js";
import { validateUpdateUserInput, validateUpdateUserPasswordInput, validateUserParams } from "../middleware/validationMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router=Router()


router.get('/',authorizePermissons,getAllUsers)
router.get('/showMe',showMe)
router.patch('/updateUser', upload.single('avatar'), validateUpdateUserInput, updateUser)
router.patch('/update-user-password',validateUpdateUserPasswordInput,  updateUserPassword)

router.get('/:id',authorizePermissons,validateUserParams, getSingleUser)


export default router