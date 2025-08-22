import { createClient } from "@libsql/client";
import jwt from 'jsonwebtoken';

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const verify = (req) => {
  const token = req.cookies['auth-token'];
  if(!token) {
    return null;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch(error) {
    return null;
  }
}

export default async function handler(req, res) {
  // All requests (POST, DELETE) now require a valid user
  const user = verify(req);
  if (!user) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  // POST: Register a new animation (either instantly or as a pending request)
  if (req.method === 'POST') {
    try {
      const { title, image, year, season, pv_url, opening_url, ending_url, contributor } = req.body;
      // If the user is an admin, process the request directly
      if (user.role === 'admin') {
        const versionHistory = JSON.stringify([{
          contributor: user.username,
          timestamp: new Date().toISOString(),
          action: '생성',
        }]);
        await db.execute({
          sql: 'INSERT INTO animations (title, image, year, season, pv_url, opening_url, ending_url, contributor, version_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          args: [title, image, year, season, pv_url, opening_url, ending_url, user.username, versionHistory],
        });
        return res.status(201).json({ message: '애니메이션이 성공적으로 추가되었습니다.' });
      } else {
        // If the user is not an admin, submit to the pending queue
        const payload = { title, image, year, season, pv_url, opening_url, ending_url, contributor: user.username };
        await db.execute({
          sql: 'INSERT INTO pending_requests (item_id, request_type, request_data, contributor) VALUES (?, ?, ?, ?)',
          args: [null, 'ADD', JSON.stringify(payload), user.username],
        });
        return res.status(201).json({ message: '애니메이션 추가 요청이 성공적으로 접수되었습니다.' });
      }
    } catch (error) {
      console.error("Failed to process POST request:", error);
      return res.status(500).json({ error: "요청 처리에 실패하였습니다." });
    }
  }


  // DELETE: Delete an animation (only for admins)
  if (req.method === 'DELETE') {
    try {
      // Only an admin can perform a direct delete
      if (user.role !== 'admin') {
        return res.status(403).json({ error: '삭제는 관리자만 할 수 있습니다.' });
      }

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: '애니메이션 ID가 누락되었습니다.' });
      }

      await db.execute({
        sql: 'DELETE FROM animations WHERE id = ?',
        args: [id],
      });

      return res.status(200).json({ message: '애니메이션이 삭제되었습니다.' });
    } catch (error) {
      console.error("Failed to delete animation:", error);
      return res.status(500).json({ error: "애니메이션 삭제에 실패하였습니다." });
    }
  }

  res.setHeader('Allow', ['POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
