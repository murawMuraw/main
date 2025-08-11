// api/stop.js
import { state } from './store.js';

export default function handler(req, res) {
  state.running = false;
  res.status(200).json({ message: 'Маршрут остановлен' });
}
