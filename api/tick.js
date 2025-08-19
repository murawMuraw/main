let currentLat = null;
let currentLon = null;

export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const qLat = req.query.lat ? parseFloat(req.query.lat) : null;
    const qLon = req.query.lon ? parseFloat(req.query.lon) : null;

    // при первом запуске — запоминаем стартовую точку, если фронт её передал
    if (currentLat === null || currentLon === null) {
      if (qLat !== null && qLon !== null) {
        currentLat = qLat;
        currentLon = qLon;
      } else {
        // запасной вариант (например, Лондон), если фронт вообще ничего не дал
        currentLat = 51.5074;
        currentLon = -0.1278;
      }
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLon}&appid=${apiKey}&units=metric`
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
