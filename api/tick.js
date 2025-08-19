let currentCoords = [51.5074, -0.1278]; // стартовые координаты (Лондон)

export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Получаем данные ветра
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${currentCoords[0]}&lon=${currentCoords[1]}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);
    const data = await response.json();

    const windDeg = data.wind?.deg ?? 0;      // направление ветра
    const windSpeed = data.wind?.speed ?? 0;  // скорость ветра в м/с

    // Смещение координат по ветру
    const distance = windSpeed * 10; // умножаем на тайминг интервала (10 сек)
    const rad = windDeg * Math.PI / 180;
    const R = 6371000; // радиус Земли в метрах

    const dLat = (distance * Math.cos(rad)) / R * (180 / Math.PI);
    const dLon = (distance * Math.sin(rad)) / (R * Math.cos(currentCoords[0] * Math.PI / 180)) * (180 / Math.PI);

    currentCoords[0] += dLat;
    currentCoords[1] += dLon;

    res.status(200).json({
      lat: currentCoords[0],
      lon: currentCoords[1],
      windDeg,
      windSpeed
    });

  } catch (error) {
    console.error("Ошибка в /api/tick.js:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
