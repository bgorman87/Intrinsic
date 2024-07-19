CREATE TABLE IF NOT EXISTS STOCKS (
    ID SERIAL PRIMARY KEY,
    Symbol TEXT,
    Exchange TEXT,
    Current FLOAT,
    PE FLOAT,
    DCF FLOAT,
    ROE FLOAT,
    Quality INT,
    Title TEXT,
    Industry TEXT,
    MarketCap FLOAT,
    Revenue FLOAT,
    NetIncome FLOAT,
    Assets FLOAT,
    Liabilities FLOAT,
    Debt FLOAT,
    ESGScore FLOAT,
    Controversy FLOAT,
    Summary TEXT,
    LongTermDebt FLOAT,
    GrowthEstimate FLOAT,
    CurrentEPS FLOAT,
    HistoricalPE FLOAT,
    CashRawEq FLOAT,
    FCFRawValue FLOAT,
    SharesOutstandingRaw FLOAT,
    StockholdersEquityRaw FLOAT,
    HistoricalROE FLOAT,
    TrailingDividendRateRaw FLOAT,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update LastUpdated column
CREATE OR REPLACE FUNCTION update_lastupdated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.LastUpdated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to use the function
CREATE TRIGGER update_stocks_lastupdated
BEFORE UPDATE ON STOCKS
FOR EACH ROW
EXECUTE FUNCTION update_lastupdated_column();