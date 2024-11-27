import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('AUDIO SERVICE IS NOT HERE! :)');
});

app.get('/backend', async (req: Request, res: Response) => {
  console.log(process.env.BACKEND_URL);
  res.send({data: (await axios.get(process.env.BACKEND_URL + '/data')).data})
});

// Start the server
app.listen(PORT, () => {
  console.log(`AUDIO SERVICE Server is running on http://localhost:${PORT}`);
});