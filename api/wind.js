// api/wind.js
import fetch from 'node-fetch';

const apiKey = '080b3dab3f26f4e8d44b5d87f4c3ee78';

export default async function handler(req, res) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Не указаны lat и lon' });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.wind) {
      return res.status(500).json({ error: 'Нет данных о ветре' });
    }

    res.status(200).json({
      speed: data.wind.speed,
      deg: data.wind.deg
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении данных ветра' });
  }
}
