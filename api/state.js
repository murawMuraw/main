import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  const data = await redis.get('circleState');
  if (!data) {
    return res.status(200).json({
      coords: [51.5, 0.0],
      path: [[51.5, 0.0]],
      windSpeed: 0,
      windDeg: 0
    });
  }
  res.status(200).json(JSON.parse(data));
}
