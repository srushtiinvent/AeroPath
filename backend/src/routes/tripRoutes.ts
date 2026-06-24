import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getHome, getFlightDetails, importTrip } from "../controllers/tripController";

const router = Router();

router.use(authMiddleware);
router.get("/home", getHome);
router.get("/flights/:id/details", getFlightDetails);
router.post("/import", importTrip);

export default router;
