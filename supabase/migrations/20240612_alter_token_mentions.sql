-- Alter token_mentions table to add missing columns if they do not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='token_mentions' AND column_name='symbol'
    ) THEN
        ALTER TABLE public.token_mentions ADD COLUMN symbol TEXT;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='token_mentions' AND column_name='count'
    ) THEN
        ALTER TABLE public.token_mentions ADD COLUMN count INTEGER NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='token_mentions' AND column_name='messages'
    ) THEN
        ALTER TABLE public.token_mentions ADD COLUMN messages JSONB NOT NULL DEFAULT '[]'::JSONB;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='token_mentions' AND column_name='created_at'
    ) THEN
        ALTER TABLE public.token_mentions ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    END IF;

    -- Add indexes for better query performance
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE tablename='token_mentions' AND indexname='idx_token_mentions_symbol'
    ) THEN
        EXECUTE 'CREATE INDEX idx_token_mentions_symbol ON token_mentions(symbol)';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE tablename='token_mentions' AND indexname='idx_token_mentions_count'
    ) THEN
        EXECUTE 'CREATE INDEX idx_token_mentions_count ON token_mentions(count)';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE tablename='token_mentions' AND indexname='idx_token_mentions_created_at'
    ) THEN
        EXECUTE 'CREATE INDEX idx_token_mentions_created_at ON token_mentions(created_at)';
    END IF;
END $$; 