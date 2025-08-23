import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { id, type } = req.query;

  if (!id || !type) {
    return res.status(400).json({ error: 'Item ID and type are required.' });
  }

  const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  try {
    let result;
    if (type === 'item') {
      result = await dbClient.execute({
        sql: 'SELECT * FROM animations WHERE id = ?',
        args: [id],
      });
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'Item not found.' });
      }
    } else if (type === 'ott-links') {
      result = await dbClient.execute({
        sql: `SELECT
                o.url,
                o.provider_id,
                p.name AS provider_name
              FROM
                ott_urls AS o
              JOIN
                ott_providers AS p ON o.provider_id = p.id
              WHERE
                o.animation_id = ?`,
        args: [Number(id)],
      });
      res.status(200).json(result.rows);
    } else {
      res.status(400).json({ error: 'Invalid type specified.' });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Failed to fetch details.' });
  }
}
