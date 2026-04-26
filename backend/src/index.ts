import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from "cors";
import { Stock, Quality, FullStock, News } from "./types";

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
  .then((client) =>
    client
      .query("SELECT NOW()")
      .then((res) => {
        console.log("Connected to database:", res.rows[0]);
        client.release();
      })
      .catch((err) => {
        client.release();
        console.error("Query error", err.stack);
      }),
  )
  .catch((err) => console.error("DB connection error", err.stack));

app.get("/api", (_req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.get("/api/stocks/:quality", async (req: Request, res: Response) => {
  const qualityParam = req.params.quality.toLowerCase();

  const qualityMap: { [key: string]: Quality } = {
    great: 1,
    good: 2,
    okay: 3,
  };

  try {
    let result;
    if (qualityParam === "all") {
      result = await pool.query<Stock>(
        `SELECT symbol, exchange, current,
                val1, val2, val3, val1_label, val2_label, val3_label,
                title, industry, sector, quality, valuation_category,
                piotroski, roic
         FROM stocks
         ORDER BY quality ASC,
                  (COALESCE(val1,0) + COALESCE(val2,0) + COALESCE(val3,0)) / 3.0 / NULLIF(current,0) DESC`,
      );
    } else {
      const quality = qualityMap[qualityParam];
      if (!quality) return res.status(400).send("Invalid quality parameter");
      result = await pool.query<Stock>(
        `SELECT symbol, exchange, current,
                val1, val2, val3, val1_label, val2_label, val3_label,
                title, industry, sector, quality, valuation_category,
                piotroski, roic
         FROM stocks
         WHERE quality = $1
         ORDER BY (COALESCE(val1,0) + COALESCE(val2,0) + COALESCE(val3,0)) / 3.0 / NULLIF(current,0) DESC`,
        [quality],
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stocks", err);
    res.status(500).send("Error fetching stocks");
  }
});

app.get(
  "/api/fullstock/:exchange/:symbol",
  async (req: Request, res: Response) => {
    try {
      const stockResult = await pool.query<FullStock>(
        `SELECT
        id, symbol, exchange, current, quality,
        valuation_category AS "valuation_category",
        val1, val2, val3, val1_label, val2_label, val3_label,
        dcf_bear AS "dcf_bear", dcf_base AS "dcf_base", dcf_bull AS "dcf_bull",
        title, sector, industry,
        marketcap AS "marketCap", summary,
        revenue, netincome AS "netIncome",
        grossprofit AS "grossProfit", operatingincome AS "operatingIncome",
        ebitda, interestexpense AS "interestExpense",
        assets, liabilities, debt,
        longtermdebt AS "longTermDebt", cashraweq AS "cashRawEq",
        stockholdersequityraw AS "stockholdersEquityRaw",
        sharesoutstandingraw AS "sharesOutstandingRaw",
        bookvaluepershare AS "bookValuePerShare",
        fcfrawvalue AS "fcfRawValue", capex,
        operatingcashflow AS "operatingCashFlow", ffo,
        currenteps AS "currentEPS", historicalpe AS "historicalPE",
        historicalroe AS "historicalROE",
        trailingdividendrateraw AS "trailingDividendRateRaw",
        growthestimate AS "growthEstimate",
        roic, piotroski,
        grossmargin AS "grossMargin", operatingmargin AS "operatingMargin",
        graham, evebitda AS "evEbitda", pricetoffo AS "priceToFfo",
        esgscore AS "esgScore", controversy,
        lastupdated AS "lastUpdated"
       FROM stocks
       WHERE symbol = $1 AND exchange = $2`,
        [req.params.symbol, req.params.exchange],
      );

      if (stockResult.rows.length === 0)
        return res.status(404).send("Stock not found");

      const stock = stockResult.rows[0];

      const newsResult = await pool.query<News>(
        `SELECT title, summary, url, provider_name, provider_publish_time
       FROM news WHERE stock_id = $1 ORDER BY provider_publish_time DESC`,
        [stock.id],
      );

      res.json({
        ...stock,
        news: newsResult.rows.length > 0 ? newsResult.rows : null,
      });
    } catch (err) {
      console.error("Error fetching full stock", err);
      res.status(500).send("Error fetching full stock");
    }
  },
);

app.get("/api/search", async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query || query.length < 2)
    return res.status(400).send("Query must be at least 2 characters");

  try {
    const result = await pool.query<Stock>(
      `SELECT symbol, exchange, current, title, industry, sector, quality, valuation_category,
              val1_label, val2_label, val3_label, piotroski, roic,
              CASE
                WHEN symbol = $1 THEN 1
                WHEN symbol ILIKE $2 THEN 2
                WHEN title ILIKE $2 THEN 3
                ELSE 4
              END AS relevance
       FROM stocks
       WHERE symbol ILIKE $2 OR title ILIKE $2
       ORDER BY relevance, symbol ASC
       LIMIT 10`,
      [query, `%${query}%`],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error searching stocks", err);
    res.status(500).send("Error searching stocks");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
