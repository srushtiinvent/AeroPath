import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getTickets, uploadTicket } from "../controllers/ticketController";

const router = Router();

router.use(authMiddleware);
router.get("/", getTickets);
router.post("/upload", uploadTicket);

export default router;
