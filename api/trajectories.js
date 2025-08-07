import { connectToDB } from '../lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const auth = req.headers.authorization?.split(' ')[1];
  const payload = jwt.verify(auth, process.env.JWT_SECRET);
  const db = await connectToDB();
  const data = await db.collection('trajectories').find({ userId: payload.userId }).toArray();
  res.json(data);
}

