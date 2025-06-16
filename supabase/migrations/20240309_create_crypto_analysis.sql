-- Create base crypto_analysis table
CREATE TABLE IF NOT EXISTS crypto_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_symbol TEXT NOT NULL,
    mention_count INTEGER NOT NULL DEFAULT 0,
    sentiment_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_crypto_analysis_token_symbol ON crypto_analysis(token_symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_analysis_created_at ON crypto_analysis(created_at);
CREATE INDEX IF NOT EXISTS idx_crypto_analysis_sentiment_score ON crypto_analysis(sentiment_score);

-- Add comment to table for documentation
COMMENT ON TABLE crypto_analysis IS 'Stores sentiment analysis results for crypto tokens';

-- Add comments to columns
COMMENT ON COLUMN crypto_analysis.token_symbol IS 'Token symbol (e.g., BTC)';
COMMENT ON COLUMN crypto_analysis.mention_count IS 'Number of times the token was mentioned';
COMMENT ON COLUMN crypto_analysis.sentiment_score IS 'Average sentiment score for the token (-1 to 1)';
COMMENT ON COLUMN crypto_analysis.created_at IS 'Timestamp when the analysis was created';
COMMENT ON COLUMN crypto_analysis.updated_at IS 'Timestamp when the analysis was last updated'; 