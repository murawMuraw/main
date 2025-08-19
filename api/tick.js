let currentLat = 51.5074; // Лондон по умолчанию
let currentLon = -0.1278;

export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const lat = req.query.lat || 51.5074;
    const lon = req.query.lon || -0.1278;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    const data = await response.json();

    const windDeg = data.wind?.deg ?? 0;
    const windSpeed = data.wind?.speed ?? 0;

    // --- движение ---
    const step = windSpeed * 0.001; // масштаб перемещения (чем больше число, тем быстрее круг)
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
