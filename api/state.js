// api/state.js
import { state } from './store.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const start = req.query.start;
    if (start) {
      const [lat, lon] = start.split(',').map(Number);
      state.lat = lat;
      state.lon = lon;
      state.running = true;
      state.path = [[lat, lon]];
    }
    res.status(200).json(state);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
