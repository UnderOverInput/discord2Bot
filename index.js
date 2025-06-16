const { Client, GatewayIntentBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

// --- CONFIGURATION ---
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const XAI_API_KEY = process.env.XAI_API_KEY;
const TARGET_CHANNEL_IDS = process.env.TARGET_CHANNEL_IDS.split(',');
const TARGET_USER_IDS = process.env.TARGET_USER_IDS.split(',');

// --- SUPABASE SETUP ---
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    // First check if we can connect
    const { data, error } = await supabase
      .from('discord_messages2')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase');
    console.log('Supabase URL:', SUPABASE_URL);

    // Now check the table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('discord_messages2')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error getting table structure:', tableError);
      return;
    }

    console.log('\n=== SUPABASE TABLE STRUCTURE ===');
    if (tableInfo && tableInfo.length > 0) {
      const columns = Object.keys(tableInfo[0]);
      console.log('Available columns:', columns.join(', '));
      
      // Compare with our insert structure
      const ourColumns = ['user_id', 'channel', 'message', 'created_at', 'server_id', 'server_name'];
      console.log('\nOur insert columns:', ourColumns.join(', '));
      
      const missingColumns = ourColumns.filter(col => !columns.includes(col));
      const extraColumns = columns.filter(col => !ourColumns.includes(col));
      
      if (missingColumns.length > 0) {
        console.log('\n❌ Missing columns in Supabase:', missingColumns.join(', '));
      }
      if (extraColumns.length > 0) {
        console.log('\nℹ️ Extra columns in Supabase:', extraColumns.join(', '));
      }
      if (missingColumns.length === 0 && extraColumns.length === 0) {
        console.log('\n✅ Schema matches perfectly!');
      }
    } else {
      console.log('No data in table to check structure');
    }
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
  }
}

// Test Supabase connection and get table structure
async function getTableStructure() {
  try {
    const { data, error } = await supabase
      .from('discord_messages2')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error getting table structure:', error);
      return null;
    }

    if (data && data.length > 0) {
      return Object.keys(data[0]);
    }
    return null;
  } catch (error) {
    console.error('Failed to get table structure:', error);
    return null;
  }
}

// Function to get top 10 crypto tokens by market cap
async function getTopCrypto() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        sparkline: false
      }
    });
    return response.data.map(coin => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      market_cap: coin.market_cap
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
}

// Function to analyze messages for token mentions and sentiment
async function analyzeMessages() {
  try {
    console.log('\n=== STARTING CRYPTO ANALYSIS ===');
    console.log('Time:', new Date().toISOString());
    
    // Get messages from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    console.log('Fetching messages since:', oneHourAgo);
    
    const { data: messages, error } = await supabase
      .from('discord_messages2')
      .select('*')
      .gte('created_at', oneHourAgo);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    console.log(`Found ${messages.length} messages to analyze`);

    // Get tokens from token dictionary
    console.log('\nFetching tokens from dictionary...');
    const { data: tokens, error: tokenError } = await supabase
      .from('token_dictionary')
      .select('*');

    if (tokenError) {
      console.error('Error fetching token dictionary:', tokenError);
      return;
    }

    console.log(`Found ${tokens.length} tokens in dictionary`);
    
    // Count token mentions
    const tokenMentions = {};
    tokens.forEach(token => {
      tokenMentions[token.symbol] = {
        count: 0,
        messages: [],
        name: token.name,
        token_type: token.token_type,
        chain: token.chain,
        trend_score: token.trend_score
      };
    });

    // Analyze messages for token mentions
    console.log('\nAnalyzing messages for token mentions...');
    messages.forEach(message => {
      const content = message.message.toUpperCase();
      tokens.forEach(token => {
        if (content.includes(token.symbol)) {
          tokenMentions[token.symbol].count++;
          tokenMentions[token.symbol].messages.push(message);
          console.log(`Found mention of ${token.symbol} in message: ${message.message.substring(0, 50)}...`);
        }
      });
    });

    // Get top mentioned tokens (with at least 1 mention)
    const topMentioned = Object.entries(tokenMentions)
      .filter(([_, data]) => data.count > 0)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10); // Get top 10 mentioned tokens

    console.log('\nTop mentioned tokens:');
    topMentioned.forEach(([symbol, data]) => {
      console.log(`${symbol}: ${data.count} mentions (Type: ${data.token_type?.join(', ') || 'unknown'})`);
    });

    // Analyze sentiment for each token
    console.log('\nAnalyzing sentiment for mentioned tokens...');
    for (const [symbol, data] of topMentioned) {
      if (data.messages.length > 0) {
        console.log(`\nAnalyzing sentiment for ${symbol}...`);
        // Use xAI for sentiment analysis
        const sentiment = await analyzeSentiment(data.messages);
        console.log(`Sentiment for ${symbol}:`, sentiment);
        
        // Store results in Supabase
        const { error: insertError } = await supabase
          .from('crypto_analysis')
          .insert([{
            token_symbol: symbol,
            token_name: data.name,
            mention_count: data.count,
            sentiment_score: sentiment.score,
            sentiment_label: sentiment.label,
            token_type: data.token_type,
            chain: data.chain,
            trend_score: data.trend_score,
            analyzed_at: new Date().toISOString()
          }]);

        if (insertError) {
          console.error(`Error storing analysis for ${symbol}:`, insertError);
        } else {
          console.log(`Successfully stored analysis for ${symbol}`);
        }
      }
    }

    console.log('\n=== CRYPTO ANALYSIS COMPLETED ===');
  } catch (error) {
    console.error('Error in analysis:', error);
  }
}

// Function to analyze sentiment using xAI
async function analyzeSentiment(messages) {
  try {
    console.log('Starting sentiment analysis...');
    // Combine all messages for analysis
    const combinedText = messages.map(m => m.message).join(' ');
    console.log('Combined text length:', combinedText.length);
    
    // Call xAI API for sentiment analysis
    const response = await axios.post('https://api.xai.com/v1/sentiment', {
      text: combinedText
    }, {
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Sentiment analysis response:', response.data);
    return {
      score: response.data.score,
      label: response.data.label
    };
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return { score: 0, label: 'neutral' };
  }
}

// Run analysis every hour
setInterval(analyzeMessages, 60 * 60 * 1000);

// Run initial analysis
analyzeMessages();

// --- DISCORD BOT SETUP ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot ID: ${client.user.id}`);
  
  // Test Supabase connection when bot starts
  await testSupabaseConnection();
  
  // Check if bot is in any guilds
  const guilds = client.guilds.cache;
  console.log(`\nBot is in ${guilds.size} guild(s):`);
  
  if (guilds.size === 0) {
    console.log('WARNING: Bot is not in any servers!');
    return;
  }

  // Verify all target channels exist
  console.log('\n=== VERIFYING TARGET CHANNELS ===');
  const allChannels = new Set();
  
  guilds.forEach(guild => {
    console.log(`\nChecking guild: ${guild.name} (${guild.id})`);
    const channels = guild.channels.cache;
    
    channels.forEach(channel => {
      if (channel.type === 0) { // 0 is GUILD_TEXT
        allChannels.add(channel.id);
        const isTargetChannel = TARGET_CHANNEL_IDS.includes(channel.id);
        console.log(`Channel: ${channel.name} (${channel.id}) - ${isTargetChannel ? '✅ Target' : '❌ Not Target'}`);
      }
    });
  });

  // Check for missing channels
  console.log('\n=== MISSING CHANNELS CHECK ===');
  TARGET_CHANNEL_IDS.forEach(channelId => {
    if (!allChannels.has(channelId)) {
      console.log(`❌ Target channel ${channelId} not found in any server`);
    }
  });
});

client.on('error', error => {
  console.error('Discord client error:', error);
});

client.on('messageCreate', async (message) => {
  try {
    // Special logging for our target user
    if (message.author.id === '882729616840736778') {
      console.log('\n🔔 MESSAGE FROM TARGET USER 🔔');
      console.log(`Time: ${new Date().toISOString()}`);
      console.log(`From: ${message.author.tag} (${message.author.id})`);
      console.log(`Channel: ${message.channel.name} (${message.channel.id})`);
      console.log(`Content: ${message.content}`);
      console.log(`Server: ${message.guild.name}`);
    }

    // Log ALL messages that come in
    console.log('\n=== INCOMING MESSAGE ===');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`From: ${message.author.tag} (${message.author.id})`);
    console.log(`Channel: ${message.channel.name} (${message.channel.id})`);
    console.log(`Server: ${message.guild.name}`);
    console.log(`Content: ${message.content}`);
    console.log(`Is Bot: ${message.author.bot}`);
    
    // Log channel and user matching status
    const isTargetChannel = TARGET_CHANNEL_IDS.includes(message.channel.id);
    const isTargetUser = TARGET_USER_IDS.includes(message.author.id);
    
    console.log('\n=== MATCHING STATUS ===');
    console.log(`Target User IDs: ${TARGET_USER_IDS.join(', ')}`);
    console.log(`Target Channel IDs: ${TARGET_CHANNEL_IDS.join(', ')}`);
    console.log(`Channel match: ${isTargetChannel} (${message.channel.id})`);
    console.log(`User match: ${isTargetUser} (${message.author.id})`);

    // Filter by channel and user
    if (isTargetChannel && isTargetUser) {
      console.log('\n=== PROCESSING MESSAGE ===');
      
      // Get table structure first
      const tableColumns = await getTableStructure();
      console.log('\n=== TABLE STRUCTURE ===');
      console.log('Available columns:', tableColumns ? tableColumns.join(', ') : 'Could not get columns');

      // Prepare insert data
      const insertData = {
        user_id: message.author.id,
        channel: message.channel.id,
        message: message.content,
        created_at: message.createdAt.toISOString(),
        server_id: message.guild.id,
        server_name: message.guild.name
      };

      console.log('\n=== ATTEMPTING INSERT ===');
      console.log('Data to insert:', JSON.stringify(insertData, null, 2));
      
      // Store message in Supabase
      const { error } = await supabase
        .from('discord_messages2')
        .insert([insertData]);
      
      if (error) {
        console.error('\n❌ Supabase insert error:', error);
        console.log('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('\n✅ Message successfully stored in Supabase');
      }
    } else {
      console.log('\n❌ Message did not meet criteria for storage');
      if (!isTargetChannel) {
        console.log(`- Channel ID ${message.channel.id} not in target list: ${TARGET_CHANNEL_IDS.join(', ')}`);
      }
      if (!isTargetUser) {
        console.log(`- User ID ${message.author.id} not in target list: ${TARGET_USER_IDS.join(', ')}`);
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

client.login(DISCORD_TOKEN);