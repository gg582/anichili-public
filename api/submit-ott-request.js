import { createClient } from '@libsql/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { animation_id, ott_urls } = req.body;

  if (!animation_id || !Array.isArray(ott_urls)) {
    return res.status(400).json({ error: 'animation_id and ott_urls are required.' });
  }

  const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  try {
    const requestData = JSON.stringify({ ott_urls });
    
    await dbClient.execute({
      sql: 'INSERT INTO pending_requests (item_id, request_type, request_data, created_at) VALUES (?, ?, ?, ?)',
      args: [animation_id, 'OTT_UPDATE', requestData, new Date().toISOString()],
    });
    
    res.status(201).json({ message: 'OTT correction request submitted successfully.' });
  } catch (error) {
    console.error('Database operation error:', error);
    res.status(500).json({ error: 'Failed to submit request.' });
  }
}
