"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid Authorization header' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = await firebase_1.default.auth().verifyIdToken(token);
        req.uid = decoded.uid;
        req.user = decoded;
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Unauthorized', detail: err.message });
    }
};
exports.authMiddleware = authMiddleware;
exports.default = exports.authMiddleware;
//# sourceMappingURL=authMiddleware.js.map