import { stopMoving } from './path.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    stopMoving();
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}
