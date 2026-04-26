-- Reader: Express backend (SELECT only)
CREATE USER intrinsic_reader WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE intrinsic TO intrinsic_reader;
GRANT USAGE ON SCHEMA public TO intrinsic_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO intrinsic_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO intrinsic_reader;

-- Writer: Stock-fetcher (INSERT/UPDATE, no DELETE, no schema changes)
CREATE USER intrinsic_writer WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE intrinsic TO intrinsic_writer;
GRANT USAGE ON SCHEMA public TO intrinsic_writer;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO intrinsic_writer;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO intrinsic_writer;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO intrinsic_writer;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO intrinsic_writer;