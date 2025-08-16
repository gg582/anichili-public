import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Fetch all animations from the 'animations' table
    const result = await db.execute('SELECT * FROM animations ORDER BY year DESC, season DESC, created_at DESC');

    // Return the fetched data as JSON
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch animations:", error);
    res.status(500).json({ error: "애니메이션을 받아오는 데 실패하였습니다. 관리자에게 연락하세요." });
  }
}
