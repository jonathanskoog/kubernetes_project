import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});