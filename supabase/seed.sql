-- Insert test data into parsed_messages table
INSERT INTO parsed_messages (token, token_name, text, created_at)
VALUES 
    ('BTC', 'Bitcoin', 'Just bought some BTC, feeling bullish!', NOW() - INTERVAL '1 day'),
    ('ETH', 'Ethereum', 'ETH looking strong today', NOW() - INTERVAL '12 hours'),
    ('SOL', 'Solana', 'SOL price action is insane', NOW() - INTERVAL '6 hours'),
    ('DOGE', 'Dogecoin', 'DOGE to the moon!', NOW() - INTERVAL '3 hours'),
    ('ADA', 'Cardano', 'ADA showing good fundamentals', NOW() - INTERVAL '1 hour');

-- Insert test data into discord_messages2 table
INSERT INTO discord_messages2 (user_id, channel, message, server_id, server_name)
VALUES 
    ('user1', 'crypto-chat', 'Just bought some BTC, feeling bullish!', 'server1', 'Crypto Trading'),
    ('user2', 'crypto-chat', 'ETH looking strong today', 'server1', 'Crypto Trading'),
    ('user3', 'crypto-chat', 'SOL price action is insane', 'server1', 'Crypto Trading'),
    ('user4', 'crypto-chat', 'DOGE to the moon!', 'server1', 'Crypto Trading'),
    ('user5', 'crypto-chat', 'ADA showing good fundamentals', 'server1', 'Crypto Trading');

-- Insert test data into token_dictionary table
INSERT INTO token_dictionary (symbol, name)
VALUES 
    ('BTC', 'Bitcoin'),
    ('ETH', 'Ethereum'),
    ('SOL', 'Solana'),
    ('DOGE', 'Dogecoin'),
    ('ADA', 'Cardano'); 