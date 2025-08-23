import 'dotenv/config';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Main handler for POST requests to /api/auth
export default async function handler(req, res) {
  // Debug: Log module availability
  console.log('Modules loaded:', {
    dotenv: !!process.env.DATABASE_URL,
    libsql: !!createClient,
    bcrypt: !!bcrypt,
    jwt: !!jwt,
    cookie: !!cookie,
    serialize: typeof cookie?.serialize
  });

  if (req.method === 'POST') {
    try {
      // Initialize database client
      const db = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      });

      // Extract and validate input
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: '사용자명과 비밀번호를 입력해주세요.' });
      }

      // Query admins table
      const result = await db.execute({
        sql: 'SELECT * FROM admins WHERE username = ?',
        args: [username],
      });

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'ID 혹은 비밀번호가 맞지 않습니다.' });
      }

      const user = result.rows[0];

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'ID 혹은 비밀번호가 맞지 않습니다.' });
      }

      // Create JWT
      const payload = {
        id: user.id,
        username: user.username,
        role: 'admin',
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated JWT:', token);

      // Set cookie options for Vercel (HTTPS)
      const cookieOptions = {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60, // 1 hour
        secure: true, // Required for Vercel HTTPS
        sameSite: 'Lax', // Suitable for same-domain requests
      };

      // Check if cookie module is valid
      if (!cookie || typeof cookie.serialize !== 'function') {
        console.error('cookie module failed to load');
        return res.status(500).json({ message: '서버 설정 오류: cookie 모듈 문제' });
      }

      // Serialize and set cookie
      const serializedCookie = cookie.serialize('auth-token', token, cookieOptions);
      console.log('Setting cookie:', serializedCookie);
      res.setHeader('Set-Cookie', serializedCookie);

      // Return success response
      return res.status(200).json({
        success: true,
        message: '로그인 성공',
      });
    } catch (error) {
      console.error('Login failed:', error);
      return res.status(500).json({ message: '서버 내부 오류' });
    }
  } else {
    // Handle non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
