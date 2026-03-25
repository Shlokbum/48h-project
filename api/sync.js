import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Authentication removed as per user request (single user app)
  
  // 1. Handle GET (Fetch State)
  if (req.method === 'GET') {
    try {
      const state = await kv.get('48h_project_state');
      return res.status(200).json(state || { epics: [], tasks: [] });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch from KV.' });
    }
  }

  // 3. Handle POST (Save State)
  if (req.method === 'POST') {
    try {
      const newState = req.body;
      await kv.set('48h_project_state', newState);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save to KV.' });
    }
  }

  // 4. Method Not Allowed
  return res.status(405).json({ error: 'Method Not Allowed' });
}
