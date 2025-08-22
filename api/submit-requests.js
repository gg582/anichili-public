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
        const { request_type, request_data } = req.body;
        
        if (!request_type) {
            return res.status(400).json({ error: 'request_type is required.' });
        }
        
        // Determine the item_id based on the request type
        // Use null for new additions and the provided id for edits/deletes
        const itemId = request_type === 'ADD' ? null : request_data?.id;

        const contributor = request_data?.contributor;
        if (!contributor) {
            return res.status(400).json({ error: 'Contributor is required.' });
        }

        const dataString = JSON.stringify(request_data);

        await dbClient.execute({
            sql: 'INSERT INTO pending_requests (item_id, request_type, request_data, contributor) VALUES (?, ?, ?, ?)',
            args: [itemId, request_type, dataString, contributor],
        });

        return res.status(201).json({ message: '요청이 성공적으로 접수되었습니다. 관리자 승인 후 반영됩니다.' });

    } catch (error) {
        console.error("Failed to submit request:", error);
        return res.status(500).json({ error: "요청 접수에 실패하였습니다." });
    }
}
