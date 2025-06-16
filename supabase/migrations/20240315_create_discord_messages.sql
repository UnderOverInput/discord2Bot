-- Create table for storing Discord messages
CREATE TABLE IF NOT EXISTS discord_messages2 (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    channel TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    server_id TEXT NOT NULL,
    server_name TEXT NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_discord_messages2_channel ON discord_messages2(channel);
CREATE INDEX IF NOT EXISTS idx_discord_messages2_created_at ON discord_messages2(created_at);
CREATE INDEX IF NOT EXISTS idx_discord_messages2_server_id ON discord_messages2(server_id);
CREATE INDEX IF NOT EXISTS idx_discord_messages2_user_id ON discord_messages2(user_id);

-- Add comment to table for documentation
COMMENT ON TABLE discord_messages2 IS 'Stores Discord messages for crypto analysis';

-- Add comments to columns
COMMENT ON COLUMN discord_messages2.user_id IS 'The Discord user ID who sent the message';
COMMENT ON COLUMN discord_messages2.channel IS 'The Discord channel where the message was sent';
COMMENT ON COLUMN discord_messages2.message IS 'The content of the Discord message';
COMMENT ON COLUMN discord_messages2.created_at IS 'When the message was created in Discord';
COMMENT ON COLUMN discord_messages2.server_id IS 'The Discord server ID where the message was sent';
COMMENT ON COLUMN discord_messages2.server_name IS 'The name of the Discord server'; 