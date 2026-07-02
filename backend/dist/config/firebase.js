"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;
if (!firebase_admin_1.default.apps.length) {
    const initOptions = {};
    if (serviceAccount) {
        initOptions.credential = firebase_admin_1.default.credential.cert(serviceAccount);
    }
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs_1.default.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
        initOptions.credential = firebase_admin_1.default.credential.applicationDefault();
    }
    if (process.env.FIREBASE_STORAGE_BUCKET) {
        initOptions.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
    }
    firebase_admin_1.default.initializeApp(initOptions);
}
exports.default = firebase_admin_1.default;
//# sourceMappingURL=firebase.js.map