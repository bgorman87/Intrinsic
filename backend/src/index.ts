import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from "cors";
import { Stock, Quality } from "./types";

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.SITE_URL,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
});

pool
  .connect()
  .then((client) => {
    return client
      .query("SELECT NOW()")
      .then((res) => {
        console.log("Connected to database:", res.rows[0]);
        client.release();
      })
      .catch((err) => {
        client.release();
        console.error("Error executing query", err.stack);
      });
  })
  .catch((err) => console.error("Error connecting to database", err.stack));

app.get("/api", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.get("/api/stocks/:quality", async (req: Request, res: Response) => {
  const qualityMap: { [key: string]: Quality } = {
    great: 1,
    good: 2,
    okay: 3,
  };

  const quality = qualityMap[req.params.quality.toLowerCase()];

  if (!quality) {
    return res.status(400).send("Invalid quality parameter");
  }

  try {
    const result = await pool.query<Stock>(
      `SELECT symbol, exchange, current, pe, dcf, roe, title, industry, summary 
       FROM stocks 
       WHERE quality = $1 
       ORDER BY (COALESCE(pe, 0) + COALESCE(dcf, 0) + COALESCE(roe, 0)) / 3 / current DESC;`,
      [quality]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stocks", err.stack);
    res.status(500).send("Error fetching stocks");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
