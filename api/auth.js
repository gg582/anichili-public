import { createClient } from "@libsql/client";
import bcrypt from 'bcrypt'; // 이 부분을 require에서 import로 변경했습니다.

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Fetch the admin user by username
      const result = await db.execute({
        sql: 'SELECT * FROM admins WHERE username = ?',
        args: [username],
      });

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'ID 혹은 비밀번호가 맞지 않습니다.' });
      }

      const user = result.rows[0];
      
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // In a real application, you would generate a JWT token here
        return res.status(200).json({ success: true, message: '로그인 성공' });
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
