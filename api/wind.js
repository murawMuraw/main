// api/wind.js
const apiKey = '080b3dab3f26f4e8d44b5d87f4c3ee78';  // твой ключ OpenWeatherMap

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    res.status(400).json({ error: 'Отсутствуют координаты lat и lon' });
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка запроса к OpenWeatherMap' });
  }
}
