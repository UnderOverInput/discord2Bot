CREATE TABLE IF NOT EXISTS crypto_analysis (
  id BIGSERIAL PRIMARY KEY,
  token_symbol TEXT NOT NULL,
  token_name TEXT NOT NULL,
  mention_count INTEGER NOT NULL,
  sentiment_score FLOAT NOT NULL,
  sentiment_label TEXT NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crypto_analysis_token_symbol ON crypto_analysis(token_symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_analysis_analyzed_at ON crypto_analysis(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_crypto_analysis_sentiment_score ON crypto_analysis(sentiment_score);

COMMENT ON TABLE crypto_analysis IS 'Stores sentiment analysis results for crypto token mentions in Discord messages';

COMMENT ON COLUMN crypto_analysis.token_symbol IS 'The symbol of the crypto token (e.g., BTC, ETH)';
COMMENT ON COLUMN crypto_analysis.token_name IS 'The full name of the crypto token';
COMMENT ON COLUMN crypto_analysis.mention_count IS 'Number of times the token was mentioned in the analyzed period';
COMMENT ON COLUMN crypto_analysis.sentiment_score IS 'Sentiment score from xAI analysis (-1 to 1)';
COMMENT ON COLUMN crypto_analysis.sentiment_label IS 'Sentiment label (positive/negative/neutral)';
COMMENT ON COLUMN crypto_analysis.analyzed_at IS 'Timestamp when the analysis was performed';
COMMENT ON COLUMN crypto_analysis.created_at IS 'Timestamp when the record was created'; 