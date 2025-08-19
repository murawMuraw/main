export default async function handler(req, res) {
  try {
    // Получаем данные о ветре с OpenWeatherMap
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const lat = req.query.lat || 51.5074; // Лондон по умолчанию
    const lon = req.query.lon || -0.1278;
    console.log("API KEY:", apiKey ? "есть" : "нет");

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }

    const data = await response.json();

    const windDeg = data.wind?.deg ?? 0;
    const windSpeed = data.wind?.speed ?? 0;

    res.status(200).json({
      success: true,
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
