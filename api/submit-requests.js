// /api/submit-request.js
import { createClient } from "@libsql/client";

const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { itemId, request_type, request_data } = req.body;

        if (!itemId || !request_type) {
            return res.status(400).json({ error: 'itemId and request_type are required.' });
        }

        const dataString = request_data ? JSON.stringify(request_data) : null;

        await dbClient.execute({
            sql: 'INSERT INTO pending_requests (item_id, request_type, request_data) VALUES (?, ?, ?)',
            args: [itemId, request_type, dataString],
        });

        return res.status(201).json({ message: '요청이 성공적으로 접수되었습니다. 관리자 승인 후 반영됩니다.' });

    } catch (error) {
        console.error("Failed to submit request:", error);
        return res.status(500).json({ error: "요청 접수에 실패하였습니다." });
    }
}
