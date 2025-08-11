// api/tick.js
import { state } from './store.js';
import fetch from 'node-fetch';

const apiKey = '080b3dab3f26f4e8d44b5d87f4c3ee78'; // твой ключ OWM

export default async function handler(req, res) {
  if (!state.running) {
    return res.status(200).json(state);
  }

  try {
    // Получаем ветер для текущих координат
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${state.lat}&lon=${state.lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.wind) {
      return res.status(500).json({ error: 'Нет данных о ветре' });
    }

    const speed = data.wind.speed;
    const deg = data.wind.deg;

    // Перевод направления в радианы (в сторону ветра)
    const angleRad = (deg * Math.PI) / 180;

    const dx = speed * Math.sin(angleRad);
    const dy = -speed * Math.cos(angleRad);

    const newLat = state.lat + dy / 111320;
    const newLon = state.lon + dx / (40075000 * Math.cos(state.lat * Math.PI / 180) / 360);

    state.lat = newLat;
    state.lon = newLon;
    state.wind = { speed, deg };
    state.path.push([newLat, newLon]);

    res.status(200).json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении координат' });
  }
}
