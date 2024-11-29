import express from 'express';
import { Signup,Login, Logout, getMe, deleteUser, checkAuth } from './../controllers/auth.controller';
import { SecureRoutes } from '../middleware/authmiddleware';
import multer from 'multer';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/signup',upload.single('userProfilePic'),Signup);
router.post('/login',Login);
router.post('/logout',Logout);
router.get('/getMe',SecureRoutes,getMe);
router.delete('/delete',SecureRoutes,deleteUser);
router.get('/check-auth', checkAuth);

export default router;