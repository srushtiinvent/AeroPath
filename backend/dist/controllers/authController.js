"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncAuth = void 0;
const db_1 = __importDefault(require("../config/db"));
const firebase_1 = __importDefault(require("../config/firebase"));
const syncAuth = async (req, res) => {
    try {
        const { uid } = req.user || {};
        if (!uid)
            return res.status(401).json({ error: 'Invalid token' });
        // fetch user from firebase
        const fbUser = await firebase_1.default.auth().getUser(uid);
        const email = fbUser.email || '';
        const name = fbUser.displayName || '';
        // compute initials
        const initials = name
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
        // upsert local user
        const user = await db_1.default.user.upsert({
            where: { firebaseUid: uid },
            update: { email, name, avatarInitials: initials },
            create: {
                email,
                name,
                firebaseUid: uid,
                avatarInitials: initials,
                settings: { create: {} },
            },
            include: { settings: true },
        });
        return res.status(200).json({ user });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Auth sync failed', detail: err.message });
    }
};
exports.syncAuth = syncAuth;
exports.default = { syncAuth: exports.syncAuth };
//# sourceMappingURL=authController.js.map