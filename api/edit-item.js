import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, title, year, season, pv_url, opening_url, ending_url, contributor, image } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'Item ID, and title are required.' });
  }

  const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  try {
    await dbClient.execute({
      sql: `
        UPDATE animations 
        SET 
          title = ?, 
          year = ?, 
          season = ?, 
          pv_url = ?,
          opening_url = ?,
          ending_url = ?,
          contributor = ?,
          image = ?
        WHERE id = ?
      `,
      args: [title, year, season, pv_url, opening_url, ending_url, contributor, image, id],
    });
    
    res.status(200).json({ message: 'Item updated successfully.' });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({ error: 'Failed to update item.' });
  }
}
