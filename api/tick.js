import { addPoint, isRunning } from './path.js';

const apiKey = process.env.OPENWEATHER_API_KEY;

async function getWindData(lat, lon) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  const data = await res.json();
  return { speed: data.wind.speed, deg: data.wind.deg };
}

export default async function handler(req, res) {
  if (!isRunning()) {
    return res.status(200).json({ message: 'stopped' });
  }

  let [lat, lon] = [51.5, 0.0];
  try {
    const wind = await getWindData(lat, lon);
    const angleRad = ((wind.deg - 90) % 360) * Math.PI / 180;
    const dx = wind.speed * Math.sin(angleRad);
    const dy = -wind.speed * Math.cos(angleRad);

    const newLat = lat + (dy / 111320);
    const newLon = lon + (dx / (40075000 * Math.cos(lat * Math.PI / 180) / 360));

    addPoint([newLat, newLon]);

    res.status(200).json({ success: true, lat: newLat, lon: newLon });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
