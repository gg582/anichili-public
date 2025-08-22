import 'dotenv/config';
import { createClient } from "@libsql/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Manually parse cookies from the header for maximum reliability
      const cookies = req.headers.cookie ? 
        Object.fromEntries(req.headers.cookie.split('; ').map(c => c.split('='))) : {};
      
      const db = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      });

      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const result = await db.execute({
        sql: 'SELECT * FROM admins WHERE username = ?',
        args: [username],
      });

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'ID 혹은 비밀번호가 맞지 않습니다.' });
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const payload = {
          id: user.id,
          username: user.username,
          role: 'admin'
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });

        // SECURITY FIX: Send the token in an HttpOnly cookie
        res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=${60 * 30}`);

        return res.status(200).json({
          success: true,
          message: '로그인 성공'
        });
      } else {
        return res.status(401).json({ success: false, message: 'ID 혹은 비밀번호가 맞지 않습니다.' });
      }
    } catch (error) {
      console.error('Login failed:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
