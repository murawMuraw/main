import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  await redis.del('circleState');
  res.status(200).json({ message: 'Состояние сброшено' });
}
