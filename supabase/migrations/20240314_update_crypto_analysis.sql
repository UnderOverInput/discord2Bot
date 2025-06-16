-- Add new columns to crypto_analysis table
ALTER TABLE crypto_analysis
ADD COLUMN IF NOT EXISTS market_cap_rank INTEGER,
ADD COLUMN IF NOT EXISTS volume_rank INTEGER,
ADD COLUMN IF NOT EXISTS trending_rank INTEGER,
ADD COLUMN IF NOT EXISTS token_name TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_crypto_analysis_market_cap_rank ON crypto_analysis(market_cap_rank);
CREATE INDEX IF NOT EXISTS idx_crypto_analysis_volume_rank ON crypto_analysis(volume_rank);
CREATE INDEX IF NOT EXISTS idx_crypto_analysis_trending_rank ON crypto_analysis(trending_rank);

-- Add comment to table for documentation
COMMENT ON TABLE crypto_analysis IS 'Stores sentiment analysis results for crypto tokens with market rankings';

-- Add comments to new columns
COMMENT ON COLUMN crypto_analysis.market_cap_rank IS 'Rank of the token by market capitalization';
COMMENT ON COLUMN crypto_analysis.volume_rank IS 'Rank of the token by trading volume';
COMMENT ON COLUMN crypto_analysis.trending_rank IS 'Rank of the token in trending list';
COMMENT ON COLUMN crypto_analysis.token_name IS 'Full name of the token'; 