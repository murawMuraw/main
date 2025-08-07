import { connectToDB } from '../lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers.authorization?.split(' ')[1];
  const payload = jwt.verify(auth, process.env.JWT_SECRET);
  const db = await connectToDB();
  await db.collection('trajectories').insertOne({
    userId: payload.userId,
    points: req.body.points,
    timestamp: new Date()
  });
  res.json({ status: 'saved' });
}

