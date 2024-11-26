import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('AUDIO SERVICE IS HERE! :)');
});

// Start the server
app.listen(PORT, () => {
  console.log(`AUDIO SERVICE Server is running on http://localhost:${PORT}`);
});