let path = [[51.5, 0.0]]; // начальная точка
let running = true;

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ path, running });
  } else {
    res.status(405).end();
  }
}

export function addPoint(newPoint) {
  path.push(newPoint);
}
export function stopMoving() {
  running = false;
}
export function isRunning() {
  return running;
}
