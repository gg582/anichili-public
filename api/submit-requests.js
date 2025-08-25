import { createClient } from "@libsql/client";

const dbClient = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default async function handler(req, res) {
    // Check if the request method is POST.
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Destructure itemId, request_type, and request_data from the request body.
        const { itemId, request_type, request_data } = req.body;

        // Ensure request_type is present.
        if (!request_type) {
            return res.status(400).json({ error: 'request_type is required.' });
        }

        // Check if the contributor is provided.
        const contributor = request_data?.contributor;
        if (!contributor) {
            return res.status(400).json({ error: 'Contributor is required.' });
        }

        // Stringify the request_data object to store it as a JSON string.
        const dataString = JSON.stringify(request_data);

        // Insert the request into the pending_requests table.
        await dbClient.execute({
            sql: 'INSERT INTO pending_requests (item_id, request_type, request_data, contributor) VALUES (?, ?, ?, ?)',
            args: [itemId, request_type, dataString, contributor],
        });

        // Return a success response.
        return res.status(201).json({ message: '요청이 성공적으로 접수되었습니다. 관리자 승인 후 반영됩니다.' });

    } catch (error) {
        // Log the detailed error to the console.
        console.error("Failed to submit request:", error);
        // Return a 500 status code with a generic error message to the client.
        return res.status(500).json({ error: "요청 접수에 실패하였습니다." });
    }
}

