import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Item ID is required.' });
  }

  const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  try {
    const result = await dbClient.execute({
      sql: 'SELECT * FROM animations WHERE id = ?',
      args: [id],
    });

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Failed to fetch item.' });
  }
}
