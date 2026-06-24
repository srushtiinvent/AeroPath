import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getProfile, addVisitedCountry, updateSettings } from "../controllers/profileController";

const router = Router();

router.use(authMiddleware);
router.get("/", getProfile);
router.post("/countries", addVisitedCountry);
router.patch("/settings", updateSettings);

export default router;
