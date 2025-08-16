import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'animation ID is required.' });
  }

  const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  try {
    const result = await dbClient.execute({
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
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Failed to fetch OTT links.' });
  }
}
