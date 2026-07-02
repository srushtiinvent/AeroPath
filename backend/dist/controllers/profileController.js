"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVisitedCountry = void 0;
const db_1 = __importDefault(require("../config/db"));
const addVisitedCountry = async (req, res) => {
    try {
        const uid = req.uid;
        if (!uid)
            return res.status(401).json({ error: 'Unauthorized' });
        const { countryCode } = req.body;
        if (!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) {
            return res.status(400).json({ error: 'Invalid ISO country code' });
        }
        const user = await db_1.default.user.findUnique({ where: { firebaseUid: uid } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // upsert visited country (unique per user+country)
        const existing = await db_1.default.visitedCountry.findFirst({ where: { userId: user.id, countryCode } });
        if (existing)
            return res.status(200).json({ message: 'Already added' });
        await db_1.default.visitedCountry.create({ data: { userId: user.id, countryCode } });
        const total = await db_1.default.visitedCountry.count({ where: { userId: user.id } });
        return res.status(201).json({ message: 'Added', totalVisited: total });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add country', detail: err.message });
    }
};
exports.addVisitedCountry = addVisitedCountry;
exports.default = { addVisitedCountry: exports.addVisitedCountry };
//# sourceMappingURL=profileController.js.map