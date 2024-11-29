import  express  from "express";
import { SecureRoutes } from "../middleware/authmiddleware";
import { addPost, deletePost, fetchAllPost, fetchPost } from "../controllers/post.controller";
import multer from "multer";


const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
})})

router.post('/add-Post',SecureRoutes,upload.single('media'),addPost);
router.delete('/delete-Post/:id',SecureRoutes,deletePost);
router.get('/fetch-single-Post/:id',SecureRoutes,fetchPost);
router.get('/fetch-all-Post',SecureRoutes,fetchAllPost);

export default router;