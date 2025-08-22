export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Set-Cookie', 'auth-token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  
  return res.status(200).json({ message: '로그아웃되었습니다.' });
}
