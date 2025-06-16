-- Create table for caching token dictionary
CREATE TABLE IF NOT EXISTS token_dictionary (
    symbol TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    market_cap_rank INTEGER,
    volume_rank INTEGER,
    trending_rank INTEGER,
    dex_rank INTEGER,
    dex_volume_24h NUMERIC,
    dex_market_cap NUMERIC,
    cmc_rank INTEGER,
    cmc_market_cap NUMERIC,
    cmc_volume_24h NUMERIC,
    cmc_price NUMERIC,
    cmc_price_change_24h NUMERIC,
    trend_score NUMERIC,
    trend_signals JSONB,
    token_type TEXT[], -- Array of types: ['meme', 'defi', 'gaming', etc.]
    chain TEXT[], -- Array of chains: ['ethereum', 'bsc', 'solana', etc.]
    social_metrics JSONB, -- Social media presence and engagement
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_token_dictionary_market_cap_rank ON token_dictionary(market_cap_rank);
CREATE INDEX IF NOT EXISTS idx_token_dictionary_volume_rank ON token_dictionary(volume_rank);
CREATE INDEX IF NOT EXISTS idx_token_dictionary_trending_rank ON token_dictionary(trending_rank);
CREATE INDEX IF NOT EXISTS idx_token_dictionary_dex_rank ON token_dictionary(dex_rank);
CREATE INDEX IF NOT EXISTS idx_token_dictionary_cmc_rank ON token_dictionary(cmc_rank);
CREATE INDEX IF NOT EXISTS idx_token_dictionary_token_type ON token_dictionary USING GIN (token_type);
CREATE INDEX IF NOT EXISTS idx_token_dictionary_chain ON token_dictionary USING GIN (chain);
CREATE INDEX IF NOT EXISTS idx_token_dictionary_last_updated ON token_dictionary(last_updated);

-- Add comment to table for documentation
COMMENT ON TABLE token_dictionary IS 'Cached dictionary of crypto tokens with their rankings, metadata, and categorization';

-- Add comments to columns
COMMENT ON COLUMN token_dictionary.symbol IS 'Token symbol (e.g., BTC)';
COMMENT ON COLUMN token_dictionary.name IS 'Full name of the token (e.g., Bitcoin)';
COMMENT ON COLUMN token_dictionary.market_cap_rank IS 'Rank of the token by market capitalization';
COMMENT ON COLUMN token_dictionary.volume_rank IS 'Rank of the token by trading volume';
COMMENT ON COLUMN token_dictionary.trending_rank IS 'Rank of the token in trending list';
COMMENT ON COLUMN token_dictionary.dex_rank IS 'Rank of the token on DEX platforms';
COMMENT ON COLUMN token_dictionary.dex_volume_24h IS '24h trading volume on DEX platforms';
COMMENT ON COLUMN token_dictionary.dex_market_cap IS 'Market cap on DEX platforms';
COMMENT ON COLUMN token_dictionary.cmc_rank IS 'Rank on CoinMarketCap';
COMMENT ON COLUMN token_dictionary.cmc_market_cap IS 'Market cap from CoinMarketCap';
COMMENT ON COLUMN token_dictionary.cmc_volume_24h IS '24h volume from CoinMarketCap';
COMMENT ON COLUMN token_dictionary.cmc_price IS 'Current price from CoinMarketCap';
COMMENT ON COLUMN token_dictionary.cmc_price_change_24h IS '24h price change percentage';
COMMENT ON COLUMN token_dictionary.trend_score IS 'Overall trend score combining various metrics';
COMMENT ON COLUMN token_dictionary.trend_signals IS 'JSON object containing various trend signals';
COMMENT ON COLUMN token_dictionary.token_type IS 'Array of token types/categories';
COMMENT ON COLUMN token_dictionary.chain IS 'Array of blockchain networks the token exists on';
COMMENT ON COLUMN token_dictionary.social_metrics IS 'JSON object containing social media metrics';
COMMENT ON COLUMN token_dictionary.last_updated IS 'Timestamp of last update';
COMMENT ON COLUMN token_dictionary.created_at IS 'Timestamp when the record was first created'; 