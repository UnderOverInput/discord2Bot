import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Bot
client.on('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    const content = message.content;

    const { error } = await supabase.from('messages').insert([{
      username: message.author.tag,
      message: content,
      channel: message.channel.name
    }]);

    if (error) {
      console.error('Supabase insert error:', error.message);
    } else {
      console.log(`[Logged] ${message.author.tag}: ${content}`);
    }
  } catch (err) {
    console.error('Insert failed:', err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);
