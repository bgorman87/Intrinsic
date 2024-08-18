CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol TEXT,
    exchange TEXT,
    current FLOAT,
    pe FLOAT,
    dcf FLOAT,
    roe FLOAT,
    quality INT,
    title TEXT,
    industry TEXT,
    marketcap FLOAT,
    revenue FLOAT,
    netincome FLOAT,
    assets FLOAT,
    liabilities FLOAT,
    debt FLOAT,
    esgscore FLOAT,
    controversy FLOAT,
    summary TEXT,
    longtermdebt FLOAT,
    growthestimate FLOAT,
    currenteps FLOAT,
    historicalpe FLOAT,
    cashraweq FLOAT,
    fcfravalue FLOAT,
    sharesoutstandingraw FLOAT,
    stockholdersequityraw FLOAT,
    historicalroe FLOAT,
    trailingdividendrateraw FLOAT,
    lastupdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_symbol_exchange ON stocks(symbol, exchange);

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    stock_id INT REFERENCES stocks(id) ON DELETE CASCADE,
    news_id TEXT UNIQUE,
    title TEXT,
    summary TEXT,
    url TEXT,
    author_name TEXT,
    provider_name TEXT,
    provider_publish_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_lastupdated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.lastupdated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stocks_lastupdated
BEFORE UPDATE ON stocks
FOR EACH ROW
EXECUTE FUNCTION update_lastupdated_column();

CREATE OR REPLACE FUNCTION calculate_quality() RETURNS trigger AS $$
BEGIN
    IF NEW.pe::text = 'NaN' THEN
        NEW.pe := NULL;
    END IF;

    IF NEW.dcf::text = 'NaN' THEN
        NEW.dcf := NULL;
    END IF;

    IF NEW.roe::text = 'NaN' THEN
        NEW.roe := NULL;
    END IF;

    IF NEW.pe IS NULL AND NEW.dcf IS NULL AND NEW.roe IS NULL THEN
        NEW.quality := 4;
        RETURN NEW;
    END IF;

    NEW.pe := COALESCE(NEW.pe, 0);
    NEW.dcf := COALESCE(NEW.dcf, 0);
    NEW.roe := COALESCE(NEW.roe, 0);

    NEW.pe := CASE WHEN NEW.pe = 'Infinity'::float8 THEN 0 ELSE NEW.pe END;
    NEW.dcf := CASE WHEN NEW.dcf = 'Infinity'::float8 THEN 0 ELSE NEW.dcf END;
    NEW.roe := CASE WHEN NEW.roe = 'Infinity'::float8 THEN 0 ELSE NEW.roe END;

    NEW.quality :=
        CASE
            WHEN NEW.pe > NEW.current AND NEW.dcf > NEW.current AND NEW.roe > NEW.current THEN 1
            WHEN (NEW.pe > NEW.current AND NEW.dcf > NEW.current)
                 OR (NEW.pe > NEW.current AND NEW.roe > NEW.current)
                 OR (NEW.dcf > NEW.current AND NEW.roe > NEW.current) THEN 2
            WHEN (NEW.pe > NEW.current) OR (NEW.dcf > NEW.current) OR (NEW.roe > NEW.current) THEN 3
            ELSE 4
        END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quality
BEFORE INSERT OR UPDATE ON stocks
FOR EACH ROW
EXECUTE FUNCTION calculate_quality();
