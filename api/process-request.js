import { createClient } from '@libsql/client';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const verify = (req) => {
    const token = req.cookies['auth-token'];
    if (!token) {
        return null;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;
    } catch (error) {
        return null;
    }
}

const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const user = verify(req);
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: '관리자만 이 기능을 사용할 수 있습니다.' });
    }

    const { requestId, action } = req.body;

    if (!requestId || !action) {
        return res.status(400).json({ error: 'Request ID and action are required.' });
    }

    try {
        const requestResult = await dbClient.execute({
            sql: 'SELECT * FROM pending_requests WHERE id = ?',
            args: [requestId],
        });

        const request = requestResult.rows[0];
        if (!request) {
            return res.status(404).json({ error: 'Request not found.' });
        }

        if (action === 'reject') {
            await dbClient.execute({
                sql: 'DELETE FROM pending_requests WHERE id = ?',
                args: [requestId],
            });
            return res.status(200).json({ message: '요청이 성공적으로 거절되었습니다.' });
        }

        if (action !== 'approve') {
            return res.status(400).json({ error: 'Invalid action.' });
        }
        
        let payload = null;
        try {
            payload = request.request_data ? JSON.parse(request.request_data) : null;
        } catch (parseError) {
            console.error('Failed to parse request_data:', parseError);
            return res.status(500).json({ error: 'Invalid request data format.' });
        }

        switch (request.request_type) {
            case 'ADD': {
                if (!payload) return res.status(400).json({ error: 'ADD request requires a payload.' });
                await dbClient.execute({
                    sql: `
                        INSERT INTO animations (title, image, year, season, pv_url, opening_url, ending_url, contributor, version_history)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    args: [
                        payload.title,
                        payload.image,
                        payload.year,
                        payload.season,
                        payload.pv_url,
                        payload.opening_url,
                        payload.ending_url,
                        payload.contributor,
                        JSON.stringify([{ contributor: payload.contributor, timestamp: new Date().toISOString(), action: '생성' }]),
                    ],
                });
                break;
            }
            case 'EDIT': {
                if (!payload) return res.status(400).json({ error: 'EDIT request requires a payload.' });
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
                await dbClient.execute({
                    sql: 'DELETE FROM animations WHERE id = ?',
                    args: [request.item_id],
                });
                break;
            }
            default:
                return res.status(400).json({ error: 'Invalid request type.' });
        }

        await dbClient.execute({
            sql: 'DELETE FROM pending_requests WHERE id = ?',
            args: [requestId],
        });

        res.status(200).json({ message: '요청이 성공적으로 승인 및 적용되었습니다.' });
    } catch (error) {
        console.error('Database operation error:', error);
        res.status(500).json({ error: 'Failed to process request.' });
    }
}
