import express from 'express';
import { FetchNotification } from '../controllers/notification.controller';
import { SecureRoutes } from '../middleware/authmiddleware';

const router = express.Router();

router.get("/get-notification",SecureRoutes,FetchNotification)

export default router;