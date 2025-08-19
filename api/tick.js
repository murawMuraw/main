let currentLat = null;
let currentLon = null;

export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // если фронт передаёт lat/lon → берём их
    const startLat = parseFloat(req.query.lat || 0);
    const startLon = parseFloat(req.query.lon || 0);

    // при первом запуске сохраняем стартовую точку
    if (currentLat === null || currentLon === null) {
      currentLat = startLat;
      currentLon = startLon;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${startLat}&lon=${startLon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    const data = await response.json();

    const windDeg = data.wind?.deg ?? 0;
    const windSpeed = data.wind?.speed ?? 0;

    // шаг движения
    const step = windSpeed * 0.001;
    const rad = (windDeg * Math.PI) / 180;

    currentLat += step * Math.cos(rad);
    currentLon += step * Math.sin(rad);

    res.status(200).json({
      success: true,
      lat: currentLat,
      lon: currentLon,
      windDeg,
      windSpeed,
    });
  } catch (error) {
    console.error("Ошибка в /api/tick.js:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
