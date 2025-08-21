export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
      // можно добавить JWT, пока простая авторизация
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else {
    res.status(405).end();
  }
}

