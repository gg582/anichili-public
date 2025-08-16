// /api/get-pending-requests.js
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
      sql: 'SELECT * FROM pending_requests ORDER BY created_at DESC',
      args: [],
    });
    
    // Parse the JSON string in request_data before sending the response
    const requests = result.rows.map(row => ({
      ...row,
      request_data: row.request_data ? JSON.parse(row.request_data) : null,
    }));

    res.status(200).json(requests);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Failed to fetch request list.' });
  }
}
