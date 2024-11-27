import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Simple route
app.post('/data', async (req: Request, res: Response) => {
  const { query, file } = req.body;
  await prisma.audioEntry.create({
    data: {
      query: query,
      path: 'hej',
    }
  })
  res.send({ success: true });
})

app.get('/data', async (req: Request, res: Response) => {
  const data = await prisma.audioEntry.findMany();
  res.send({ data: data })
})

app.get('/', (req: Request, res: Response) => {
  res.send('BACKEND SERVICE IS HERE! :)');
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`BACKEND SERVICE Server is running on http://localhost:${PORT}`);
});

const shutdown = async (signal: string) => {
  await prisma.$disconnect();
  // Close the server
  server.close(() => {
    console.log('Closed all remaining connections');
    process.exit(0);  // Exit the process with success
  });

  // If we don't gracefully close within a certain time, forcefully shut down
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

// Listen for specific termination signals
process.on('SIGINT', async () => await shutdown('SIGINT')); // Handle Ctrl+C (SIGINT)
process.on('SIGTERM', async () => await shutdown('SIGTERM')); // Handle kill signal (SIGTERM)