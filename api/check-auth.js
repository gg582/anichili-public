import 'dotenv/config';
import jwt from 'jsonwebtoken';

// Handler for GET requests to /api/check-auth
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Extract cookies from request headers
      const cookies = req.headers.cookie || '';
      console.log('Cookies received:', cookies);

      const cookieMap = cookies.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});

      const token = cookieMap['auth-token'];
      console.log('Extracted auth-token:', token);

      if (!token) {
        return res.status(401).json({ authenticated: false, message: '토큰이 없습니다.' });
      }

      // Verify JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('JWT decoded:', decoded);
        return res.status(200).json({ authenticated: true, user: decoded });
      } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(401).json({ authenticated: false, message: '유효하지 않은 토큰입니다.' });
      }
    } catch (error) {
      console.error('Check-auth failed:', error);
      return res.status(500).json({ authenticated: false, message: '서버 내부 오류' });
    }
  } else {
    // Handle non-GET requests
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
