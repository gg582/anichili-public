import { createClient } from '@libsql/client';

const dbClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { requestId, action } = req.body;

  if (!requestId || !action) {
    return res.status(400).json({ error: 'Request ID and action are required.' });
  }

  try {
    // 1. Fetch the request details from the pending queue
    const requestResult = await dbClient.execute({
      sql: 'SELECT * FROM pending_requests WHERE id = ?',
      args: [requestId],
    });

    const request = requestResult.rows[0];
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    if (action === 'approve') {
      const payload = JSON.parse(request.request_data);
      
      switch (request.request_type) {
        case 'EDIT': {
          // 'EDIT' request logic: Updates only the animation details.
          // The payload follows the existing animation data format.
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
            args: [
              payload.title,
              payload.year,
              payload.season,
              payload.pv_url,
              payload.opening_url,
              payload.ending_url,
              payload.contributor,
              payload.image,
              request.item_id,
            ],
          });
          break;
        }
        case 'DELETE': {
          // 'DELETE' request logic: Deletes the animation.
          await dbClient.execute({
            sql: 'DELETE FROM animations WHERE id = ?',
            args: [request.item_id],
          });
          break;
        }
        case 'OTT_UPDATE': {
          // 'OTT_UPDATE' request logic: Updates only the OTT information.
          // The payload follows the new format containing an ott_urls array.
          const { ott_urls } = payload;
          if (!ott_urls || !Array.isArray(ott_urls)) {
            return res.status(400).json({ error: 'Invalid ott_urls payload for OTT_UPDATE request.' });
          }

          // 1. Delete existing OTT URLs for this animation
          await dbClient.execute({
            sql: 'DELETE FROM ott_urls WHERE animation_id = ?',
            args: [request.item_id],
          });
          
          // 2. Insert new OTT URLs
          for (const ott of ott_urls) {
            await dbClient.execute({
              sql: 'INSERT INTO ott_urls (animation_id, provider_id, url) VALUES (?, ?, ?)',
              args: [request.item_id, ott.provider_id, ott.url],
            });
          }
          break;
        }
        default:
          return res.status(400).json({ error: 'Invalid request type.' });
      }

    } else if (action !== 'reject') {
      return res.status(400).json({ error: 'Invalid action.' });
    }

    // After approval or rejection, delete the request from the pending queue
    await dbClient.execute({
      sql: 'DELETE FROM pending_requests WHERE id = ?',
      args: [requestId],
    });

    res.status(200).json({ message: `Request successfully ${action === 'approve' ? 'approved and applied' : 'rejected'}.` });

  } catch (error) {
    console.error('Database operation error:', error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
}
