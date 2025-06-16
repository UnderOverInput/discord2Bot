require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const content = message.content;
  const prompt = `
Classify this Discord message:

Message: "${content}"

Return JSON:
{
  "sentiment": "positive | negative | neutral",
  "tone": "bullish | bearish | neutral",
  "category": "trading | help request | meme | other",
  "tokens": ["list", "of", "mentioned", "tokens"]
}
`;

  try {
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      model: 'grok-1',
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const result = JSON.parse(response.data.choices[0].message.content);

    await supabase.from('messages').insert([{
      user: message.author.tag,
      message: content,
      channel: message.channel.name,
      sentiment: result.sentiment,
      tone: result.tone,
      category: result.category,
      tokens: result.tokens
    }]);

    console.log(`[Logged] ${message.author.tag}: ${result.category} | ${result.sentiment}`);
  } catch (err) {
    console.error('Classification or DB error:', err.message || err);
  }
});

client.login(process.env.DISCORD_TOKEN);