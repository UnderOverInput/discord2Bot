# Discord Bot for Render

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example`:

```
DISCORD_TOKEN=your_discord_bot_token_here
```

3. Start the bot locally:

```bash
npm start
```

## Deploy to Render

1. Push to GitHub.
2. Create a "Background Worker" on Render.
3. Set start command: `node bot.js`.
4. Add your `DISCORD_TOKEN` in the environment variables.