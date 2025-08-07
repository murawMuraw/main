import { connectToDB } from '../lib/db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const db = await connectToDB();
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ email, passwordHash: hash });
  res.json({ status: 'ok' });
}

