import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  // Check if KV is configured
  if (!process.env.KV_REST_API_URL && !process.env.KV_REST_API_TOKEN) {
    return response.status(500).json({ error: 'KV Database is not linked to this project in Vercel. Please connect a KV database in the Storage tab.' });
  }

  if (request.method === 'GET') {
    try {
      const state = await kv.get('48h_project_state');
      return response.status(200).json(state || { epics: [], tasks: [] });
    } catch (error) {
      console.error('KV Get Error:', error);
      return response.status(500).json({ error: 'Failed to read from KV database. Check connection.', details: error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const state = request.body;
      await kv.set('48h_project_state', state);
      return response.status(200).json({ success: true });
    } catch (error) {
      console.error('KV Set Error:', error);
      return response.status(500).json({ error: 'Failed to write to KV database. Check connection.', details: error.message });
    }
  }

  return response.status(405).json({ error: 'Method Not Allowed' });
}
