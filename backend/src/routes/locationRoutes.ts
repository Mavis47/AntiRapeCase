import  express  from "express";
import { SecureRoutes } from "../middleware/authmiddleware";
import { AddLocation, deleteLocation, getLocation } from "../controllers/geolocation.controller";

const router = express.Router();

router.get('/get-location',SecureRoutes,getLocation);
router.post('/add-location',SecureRoutes,AddLocation);
router.delete('/delete-location',SecureRoutes,deleteLocation);

export default router;