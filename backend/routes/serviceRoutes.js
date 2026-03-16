import express from "express";
const router = express.Router();
import { getServices, addService } from "../controllers/serviceController.js";

router.get("/",getServices);
router.post("/",addService);

export default router;