import { createClient } from "@libsql/client";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // The fix: Initialize the db client inside the handler function.
    const db = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    
    const { _page, _limit } = req.query;

    const page = parseInt(_page, 10) || 1;
    const limit = parseInt(_limit, 10) || 20;
    const offset = (page - 1) * limit;

    const result = await db.execute({
      sql: 'SELECT * FROM animations ORDER BY year DESC, season DESC, created_at DESC LIMIT ? OFFSET ?',
      args: [limit, offset],
    });

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch animations:", error);
    res.status(500).json({ error: "애니메이션을 받아오는 데 실패하였습니다. 관리자에게 연락하세요." });
  }
}
