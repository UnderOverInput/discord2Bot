-- First check if table exists and create if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'parsed_messages') THEN
        -- Create table for storing parsed Discord messages
        CREATE TABLE parsed_messages (
            id BIGSERIAL PRIMARY KEY,
            token TEXT NOT NULL,
            token_name TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL,
            processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Add comment to table for documentation
        COMMENT ON TABLE parsed_messages IS 'Stores parsed Discord messages with identified crypto token mentions';

        -- Add comments to columns
        COMMENT ON COLUMN parsed_messages.token IS 'The identified crypto token symbol or "unknown"';
        COMMENT ON COLUMN parsed_messages.token_name IS 'The full name of the identified crypto token or "unknown"';
        COMMENT ON COLUMN parsed_messages.text IS 'The original Discord message text';
        COMMENT ON COLUMN parsed_messages.created_at IS 'Timestamp when the message was created in Discord';
        COMMENT ON COLUMN parsed_messages.processed_at IS 'Timestamp when the message was processed and stored';

        -- Add indexes for better query performance
        CREATE INDEX idx_parsed_messages_token ON parsed_messages(token);
        CREATE INDEX idx_parsed_messages_token_name ON parsed_messages(token_name);
        CREATE INDEX idx_parsed_messages_created_at ON parsed_messages(created_at);
        CREATE INDEX idx_parsed_messages_processed_at ON parsed_messages(processed_at);
    ELSE
        -- Add token_name column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'parsed_messages' 
                      AND column_name = 'token_name') THEN
            ALTER TABLE parsed_messages 
            ADD COLUMN token_name TEXT NOT NULL DEFAULT 'unknown';
            
            COMMENT ON COLUMN parsed_messages.token_name IS 'The full name of the identified crypto token or "unknown"';
            
            -- Create index for token_name
            CREATE INDEX idx_parsed_messages_token_name ON parsed_messages(token_name);
        END IF;

        -- Add processed_at column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'parsed_messages' 
                      AND column_name = 'processed_at') THEN
            ALTER TABLE parsed_messages 
            ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            
            COMMENT ON COLUMN parsed_messages.processed_at IS 'Timestamp when the message was processed and stored';
            
            -- Create index for processed_at
            CREATE INDEX idx_parsed_messages_processed_at ON parsed_messages(processed_at);
        END IF;
    END IF;
END $$; 