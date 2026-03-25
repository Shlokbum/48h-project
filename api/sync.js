import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      const state = await prisma.appState.findUnique({
        where: { id: 'global' },
      });
      return response.status(200).json(state || { epics: [], tasks: [] });
    } catch (error) {
      console.error('Prisma GET Error:', error);
      return response.status(500).json({ error: 'Failed to read from Neon database.', details: error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const { epics, tasks } = request.body;
      const state = await prisma.appState.upsert({
        where: { id: 'global' },
        update: { epics, tasks },
        create: { id: 'global', epics, tasks },
      });
      return response.status(200).json({ success: true, state });
    } catch (error) {
      console.error('Prisma POST Error:', error);
      return response.status(500).json({ error: 'Failed to write to Neon database.', details: error.message });
    }
  }

  return response.status(405).json({ error: 'Method Not Allowed' });
}
