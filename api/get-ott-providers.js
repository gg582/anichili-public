import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  try {
    const result = await dbClient.execute({
      sql: 'SELECT id, name FROM ott_providers ORDER BY id',
      args: [],
    });

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Failed to fetch OTT providers.' });
  }
}
