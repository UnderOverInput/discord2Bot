# Discord Bot with Grok AI and Supabase

## 🛠 Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file using `.env.example`:
```
DISCORD_TOKEN=
SUPABASE_URL=
SUPABASE_ANON_KEY=
XAI_API_KEY=
```

3. Start the bot locally:
```bash
npm start
```

## 🚀 Deploy to Render

1. Push this project to GitHub.
2. Create a Render Background Worker.
3. Set your environment variables in the Render dashboard.
4. Use `node bot.js` as the start command.