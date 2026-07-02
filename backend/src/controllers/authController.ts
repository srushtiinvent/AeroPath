import { Request, Response } from 'express';
import prisma from '../config/db';
import admin from '../config/firebase';

export const syncAuth = async (req: Request, res: Response) => {
  try {
    const { uid } = (req as any).user || {};
    if (!uid) return res.status(401).json({ error: 'Invalid token' });

    // fetch user from firebase
    const fbUser = await admin.auth().getUser(uid);
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
    const user = await prisma.user.upsert({
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
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Auth sync failed', detail: err.message });
  }
};

export default { syncAuth };
