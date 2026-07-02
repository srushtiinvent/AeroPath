import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import authController from '../controllers/authController';
import tripController from '../controllers/tripController';
import profileController from '../controllers/profileController';

const router = Router();

router.post('/auth/sync', authMiddleware, authController.syncAuth);

router.get('/trips/home', authMiddleware, tripController.getHomeTimeline);
router.get('/flights/:id/details', authMiddleware, tripController.getFlightDetails);

router.post('/profile/countries', authMiddleware, profileController.addVisitedCountry);

export default router;
