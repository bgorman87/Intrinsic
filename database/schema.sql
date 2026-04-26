CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol TEXT,
    exchange TEXT,

    current FLOAT,

    valuation_category TEXT,

    val1 FLOAT,
    val2 FLOAT,
    val3 FLOAT,
    val1_label TEXT,
    val2_label TEXT,
    val3_label TEXT,

    dcf_bear FLOAT,
    dcf_base FLOAT,
    dcf_bull FLOAT,

    quality INT,

    title TEXT,
    sector TEXT,
    industry TEXT,
    marketcap FLOAT,
    summary TEXT,

    revenue FLOAT,
    netincome FLOAT,
    grossprofit FLOAT,
    operatingincome FLOAT,
    ebitda FLOAT,
    interestexpense FLOAT,
    depreciationamortization FLOAT,

    assets FLOAT,
    liabilities FLOAT,
    debt FLOAT,
    longtermdebt FLOAT,
    cashraweq FLOAT,
    stockholdersequityraw FLOAT,
    sharesoutstandingraw FLOAT,
    bookvaluepershare FLOAT,

    fcfrawvalue FLOAT,
    capex FLOAT,
    operatingcashflow FLOAT,
    ffo FLOAT,

    currenteps FLOAT,
    historicalpe FLOAT,
    historicalroe FLOAT,
    trailingdividendrateraw FLOAT,
    growthestimate FLOAT,

    roic FLOAT,
    piotroski INT,
    grossmargin FLOAT,
    operatingmargin FLOAT,
    graham FLOAT,
    evebitda FLOAT,
    pricetoffo FLOAT,

    esgscore FLOAT,
    controversy FLOAT,

    lastupdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_symbol_exchange ON stocks(symbol, exchange);

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

DROP TRIGGER IF EXISTS update_stocks_lastupdated ON stocks;
CREATE TRIGGER update_stocks_lastupdated
BEFORE UPDATE ON stocks
FOR EACH ROW
EXECUTE FUNCTION update_lastupdated_column();

CREATE OR REPLACE FUNCTION calculate_quality() RETURNS trigger AS $$
DECLARE
    v1 FLOAT;
    v2 FLOAT;
    v3 FLOAT;
    above INT;
BEGIN
    -- Sanitise NaN and Infinity
    NEW.val1 := CASE WHEN NEW.val1::text IN ('NaN','Infinity','-Infinity') THEN NULL ELSE NEW.val1 END;
    NEW.val2 := CASE WHEN NEW.val2::text IN ('NaN','Infinity','-Infinity') THEN NULL ELSE NEW.val2 END;
    NEW.val3 := CASE WHEN NEW.val3::text IN ('NaN','Infinity','-Infinity') THEN NULL ELSE NEW.val3 END;

    IF NEW.val1 IS NULL AND NEW.val2 IS NULL AND NEW.val3 IS NULL THEN
        NEW.quality := 4;
        RETURN NEW;
    END IF;

    v1 := COALESCE(NEW.val1, 0);
    v2 := COALESCE(NEW.val2, 0);
    v3 := COALESCE(NEW.val3, 0);

    above :=
        CASE WHEN v1 > NEW.current THEN 1 ELSE 0 END +
        CASE WHEN v2 > NEW.current THEN 1 ELSE 0 END +
        CASE WHEN v3 > NEW.current THEN 1 ELSE 0 END;

    NEW.quality :=
        CASE
            WHEN above = 3 THEN 1
            WHEN above = 2 THEN 2
            WHEN above = 1 THEN 3
            ELSE 4
        END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_quality ON stocks;
CREATE TRIGGER update_quality
BEFORE INSERT OR UPDATE ON stocks
FOR EACH ROW
EXECUTE FUNCTION calculate_quality();