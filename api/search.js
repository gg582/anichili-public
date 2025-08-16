// api/search.js
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query "q" is required' });
      }

      const searchTerm = `%${q}%`;
      
      const result = await db.execute({
        sql: "SELECT * FROM animations WHERE title LIKE ?",
        args: [searchTerm],
      });

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Search failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
