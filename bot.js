require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  console.log(`[${message.author.tag}]: ${message.content}`);

  if (message.content.toLowerCase() === 'ping') {
    message.channel.send('pong');
  }
});

client.login(process.env.DISCORD_TOKEN);