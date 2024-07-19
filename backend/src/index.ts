import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: process.env.SITE_URL,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// PostgreSQL client setup
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
});

pool.connect()
  .then(client => {
    return client.query('SELECT NOW()')
      .then(res => {
        console.log('Connected to database:', res.rows[0]);
        client.release();
      })
      .catch(err => {
        client.release();
        console.error('Error executing query', err.stack);
      });
  })
  .catch(err => console.error('Error connecting to database', err.stack));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

// API route
app.get('/api', (req: Request, res: Response) => {
  res.send('API endpoint');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
