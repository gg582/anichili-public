import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default async function handler(req, res) {
  // POST: Register a new animation
  if (req.method === 'POST') {
    try {
      const { title, image, year, season, pv_url, opening_url, ending_url, contributor } = req.body;

      if (!title || !year || !season || !contributor) {
        return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
      }

      const versionHistory = JSON.stringify([{
        contributor,
        timestamp: new Date().toISOString(),
        action: '생성',
      }]);

      await db.execute({
        sql: 'INSERT INTO animations (title, image, year, season, pv_url, opening_url, ending_url, contributor, version_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [title, image, year, season, pv_url, opening_url, ending_url, contributor, versionHistory],
      });

      return res.status(201).json({ message: '애니메이션이 성공적으로 추가되었습니다.' });
    } catch (error) {
      console.error("Failed to add animation:", error);
      return res.status(500).json({ error: "애니메이션 추가에 실패하였습니다." });
    }
  }

  // PUT: Update animation information
  if (req.method === 'PUT') {
    // ... (Add your animation update logic here) ...
    return res.status(501).json({ error: 'Not Implemented' });
  }

  // DELETE: Delete an animation
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const { authorization } = req.headers;

      if (!authorization || authorization !== 'Bearer your_admin_auth') {
        return res.status(403).json({ error: '삭제는 관리자만 할 수 있습니다.' });
      }

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

  res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
