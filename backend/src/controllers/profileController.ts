import { Request, Response } from 'express';
import prisma from '../config/db';

export const addVisitedCountry = async (req: Request, res: Response) => {
  try {
    const uid = (req as any).uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    const { countryCode } = req.body;
    if (!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) {
      return res.status(400).json({ error: 'Invalid ISO country code' });
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // upsert visited country (unique per user+country)
    const existing = await prisma.visitedCountry.findFirst({ where: { userId: user.id, countryCode } });
    if (existing) return res.status(200).json({ message: 'Already added' });

    await prisma.visitedCountry.create({ data: { userId: user.id, countryCode } });

    const total = await prisma.visitedCountry.count({ where: { userId: user.id } });

    return res.status(201).json({ message: 'Added', totalVisited: total });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to add country', detail: err.message });
  }
};

export default { addVisitedCountry };
