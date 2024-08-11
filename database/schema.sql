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

CREATE UNIQUE INDEX idx_symbol_exchange ON stocks(symbol, exchange);

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

-- Function to calculate quality
CREATE OR REPLACE FUNCTION calculate_quality() RETURNS trigger AS $$
BEGIN
    -- Check if pe, dcf, and roe are all NULL
    IF NEW.pe IS NULL AND NEW.dcf IS NULL AND NEW.roe IS NULL THEN
        NEW.quality := 5;
        RETURN NEW;
    END IF;

    -- Set pe, dcf, and roe to 0 if they are NULL
    NEW.pe := COALESCE(NEW.pe, 0);
    NEW.dcf := COALESCE(NEW.dcf, 0);
    NEW.roe := COALESCE(NEW.roe, 0);

    -- Handle infinity values
    NEW.pe := CASE WHEN NEW.pe = 'Infinity'::float8 THEN 0 ELSE NEW.pe END;
    NEW.dcf := CASE WHEN NEW.dcf = 'Infinity'::float8 THEN 0 ELSE NEW.dcf END;
    NEW.roe := CASE WHEN NEW.roe = 'Infinity'::float8 THEN 0 ELSE NEW.roe END;

    -- Calculate the number of values greater than the current value
    NEW.quality := 
        CASE
            WHEN (NEW.pe > NEW.current) AND (NEW.dcf > NEW.current) AND (NEW.roe > NEW.current) THEN 1
            WHEN (NEW.pe > NEW.current) AND (NEW.dcf > NEW.current) OR (NEW.pe > NEW.current) AND (NEW.roe > NEW.current) OR (NEW.dcf > NEW.current) AND (NEW.roe > NEW.current) THEN 2
            WHEN (NEW.pe > NEW.current) OR (NEW.dcf > NEW.current) OR (NEW.roe > NEW.current) THEN 3
            ELSE 4
        END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger to use the quality function
CREATE TRIGGER update_quality
BEFORE INSERT OR UPDATE ON public.stocks
FOR EACH ROW
EXECUTE FUNCTION calculate_quality();