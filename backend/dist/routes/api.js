"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authController_1 = __importDefault(require("../controllers/authController"));
const tripController_1 = __importDefault(require("../controllers/tripController"));
const profileController_1 = __importDefault(require("../controllers/profileController"));
const router = (0, express_1.Router)();
router.post('/auth/sync', authMiddleware_1.default, authController_1.default.syncAuth);
router.get('/trips/home', authMiddleware_1.default, tripController_1.default.getHomeTimeline);
router.get('/flights/:id/details', authMiddleware_1.default, tripController_1.default.getFlightDetails);
router.post('/profile/countries', authMiddleware_1.default, profileController_1.default.addVisitedCountry);
exports.default = router;
//# sourceMappingURL=api.js.map