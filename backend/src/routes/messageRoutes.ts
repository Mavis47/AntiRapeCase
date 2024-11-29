import  express  from "express";
import { SecureRoutes } from './../middleware/authmiddleware';
import { deleteMessage, getMessage, sendMessage } from "../controllers/message.controller";

const router = express.Router();

router.post("/send-Message",SecureRoutes,sendMessage);
router.get("/get-Message/:receiverId",SecureRoutes,getMessage);
router.delete("/delete-Message",SecureRoutes,deleteMessage);

export default router;