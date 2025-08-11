import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

const apiKey = process.env.OPENWEATHER_KEY;

async function getWind(lat, lon) {
  const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  const data = await r.json();
  return { speed: data.wind.speed, deg: data.wind.deg };
}

export default async function handler(req, res) {
  let state = await redis.get('circleState');
  if (!state) {
    state = {
      coords: [51.5, 0.0],
      path: [[51.5, 0.0]],
      windSpeed: 0,
      windDeg: 0
    };
  } else {
    state = JSON.parse(state);
  }

  const [lat, lon] = state.coords;
  const wind = await getWind(lat, lon);

  const angleRad = ((wind.deg + 180) % 360) * Math.PI / 180;
  const dx = wind.speed * Math.sin(angleRad);
  const dy = -wind.speed * Math.cos(angleRad);

  const newLat = lat + (dy / 111320);
  const newLon = lon + (dx / (40075000 * Math.cos(lat * Math.PI / 180) / 360));

  state.coords = [newLat, newLon];
  state.windSpeed = wind.speed;
  state.windDeg = wind.deg;
  state.path.push(state.coords);

  await redis.set('circleState', JSON.stringify(state));
  res.status(200).json(state);
}
