import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';

export interface AuthedRequest extends Request {
  uid?: string;
  user?: any;
}

export const authMiddleware = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1] as string;
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    req.user = decoded;
    return next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Unauthorized', detail: err.message });
  }
};

export default authMiddleware;
