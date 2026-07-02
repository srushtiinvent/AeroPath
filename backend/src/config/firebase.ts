import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

if (!admin.apps.length) {
  const initOptions: admin.AppOptions = {};

  if (serviceAccount) {
    initOptions.credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    initOptions.credential = admin.credential.applicationDefault();
  }

  if (process.env.FIREBASE_STORAGE_BUCKET) {
    initOptions.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  }

  admin.initializeApp(initOptions as admin.AppOptions);
}

export default admin;
