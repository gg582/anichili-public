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
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const user = verify(req);
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Access Denied: Only administrators can view pending requests.' });
    }

    try {
        const result = await dbClient.execute({
            sql: 'SELECT * FROM pending_requests ORDER BY created_at DESC',
            args: [],
        });

        const pendingRequests = result.rows.map(row => ({
            ...row,
            request_data: row.request_data ? JSON.parse(row.request_data) : null,
        }));

        return res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        return res.status(500).json({ error: 'Failed to fetch pending requests.' });
    }
}
