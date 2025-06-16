import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenInfo {
  symbol: string;
  name: string;
  market_cap_rank?: number;
  trending_rank?: number;
  volume_rank?: number;
  dex_rank?: number;
  dex_volume_24h?: number;
  dex_market_cap?: number;
  cmc_rank?: number;
  cmc_market_cap?: number;
  cmc_volume_24h?: number;
  cmc_price?: number;
  cmc_price_change_24h?: number;
  trend_score?: number;
  trend_signals?: {
    price_surge?: boolean;
    volume_surge?: boolean;
    momentum?: number;
    volatility?: number;
    market_signals?: {
      price_acceleration?: number;
      volume_acceleration?: number;
      market_cap_growth?: number;
      liquidity_score?: number;
    };
    historical_trends?: {
      price_trend?: number[];
      volume_trend?: number[];
      market_cap_trend?: number[];
      trend_direction?: 'up' | 'down' | 'sideways';
      trend_strength?: number;
    };
  };
  token_type?: string[];
  chain?: string[];
  social_metrics?: {
    twitter_followers?: number;
    twitter_engagement?: number;
    telegram_members?: number;
    discord_members?: number;
    reddit_subscribers?: number;
    reddit_engagement?: number;
  };
  last_updated: string;
}

// Function to fetch tokens by market cap from CoinGecko
async function fetchTokensByMarketCap(): Promise<TokenInfo[]> {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
  const data = await response.json();
  return data.map((coin: any, index: number) => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    market_cap_rank: index + 1,
    cmc_market_cap: coin.market_cap,
    cmc_volume_24h: coin.total_volume,
    cmc_price: coin.current_price,
    cmc_price_change_24h: coin.price_change_percentage_24h,
    last_updated: new Date().toISOString()
  }));
}

// Function to fetch trending tokens from CoinGecko
async function fetchTrendingTokens(): Promise<TokenInfo[]> {
  const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
  const data = await response.json();
  return data.coins.map((coin: any, index: number) => ({
    symbol: coin.item.symbol.toUpperCase(),
    name: coin.item.name,
    trending_rank: index + 1,
    last_updated: new Date().toISOString()
  }));
}

// Function to fetch tokens by volume from CoinGecko
async function fetchTokensByVolume(): Promise<TokenInfo[]> {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=250&page=1&sparkline=false');
  const data = await response.json();
  return data.map((coin: any, index: number) => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    volume_rank: index + 1,
    last_updated: new Date().toISOString()
  }));
}

// Function to fetch DEX tokens from CoinGecko
async function fetchDexTokens(): Promise<TokenInfo[]> {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=decentralized-exchange&order=market_cap_desc&per_page=100&page=1&sparkline=false');
  const data = await response.json();
  return data.map((coin: any, index: number) => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    dex_rank: index + 1,
    dex_volume_24h: coin.total_volume,
    dex_market_cap: coin.market_cap,
    token_type: ['defi', 'dex'],
    last_updated: new Date().toISOString()
  }));
}

// Function to fetch meme tokens from CoinGecko
async function fetchMemeTokens(): Promise<TokenInfo[]> {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=100&page=1&sparkline=false');
  const data = await response.json();
  return data.map((coin: any, index: number) => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    market_cap_rank: index + 1,
    token_type: ['meme'],
    last_updated: new Date().toISOString()
  }));
}

// Function to fetch gaming tokens from CoinGecko
async function fetchGamingTokens(): Promise<TokenInfo[]> {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=gaming&order=market_cap_desc&per_page=100&page=1&sparkline=false');
  const data = await response.json();
  return data.map((coin: any, index: number) => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    market_cap_rank: index + 1,
    token_type: ['gaming'],
    last_updated: new Date().toISOString()
  }));
}

// Function to calculate trend score and signals
function calculateTrendSignals(token: TokenInfo): TokenInfo {
  const signals = {
    price_surge: false,
    volume_surge: false,
    momentum: 0,
    volatility: 0,
    market_signals: {
      price_acceleration: 0,
      volume_acceleration: 0,
      market_cap_growth: 0,
      liquidity_score: 0
    },
    historical_trends: {
      price_trend: [],
      volume_trend: [],
      market_cap_trend: [],
      trend_direction: 'sideways' as const,
      trend_strength: 0
    }
  };

  // Calculate basic signals
  if (token.cmc_price_change_24h && token.cmc_price_change_24h > 20) {
    signals.price_surge = true;
  }

  if (token.cmc_volume_24h && token.cmc_market_cap) {
    const volumeToMarketCap = token.cmc_volume_24h / token.cmc_market_cap;
    if (volumeToMarketCap > 0.5) {
      signals.volume_surge = true;
    }
  }

  // Calculate trend score (0-100)
  let trendScore = 0;
  if (token.trending_rank) trendScore += (100 - token.trending_rank) * 0.3;
  if (token.cmc_price_change_24h) trendScore += Math.min(Math.abs(token.cmc_price_change_24h), 100) * 0.3;
  if (signals.price_surge) trendScore += 20;
  if (signals.volume_surge) trendScore += 20;

  return {
    ...token,
    trend_score: Math.min(trendScore, 100),
    trend_signals: signals
  };
}

// Function to update the cache
async function updateTokenDictionaryCache(supabaseClient: any): Promise<{ success: boolean; message: string; stats: any }> {
  try {
    console.log('Starting token dictionary cache update...');
    
    // Fetch data from all endpoints
    const [
      marketCapTokens, 
      trendingTokens, 
      volumeTokens,
      dexTokens,
      memeTokens,
      gamingTokens
    ] = await Promise.all([
      fetchTokensByMarketCap(),
      fetchTrendingTokens(),
      fetchTokensByVolume(),
      fetchDexTokens(),
      fetchMemeTokens(),
      fetchGamingTokens()
    ]);

    // Prepare data for upsert
    const tokensToUpsert = new Map<string, any>();
    const stats = {
      market_cap_tokens: marketCapTokens.length,
      trending_tokens: trendingTokens.length,
      volume_tokens: volumeTokens.length,
      dex_tokens: dexTokens.length,
      meme_tokens: memeTokens.length,
      gaming_tokens: gamingTokens.length,
      total_unique_tokens: 0
    };

    // Process all token sources
    const allTokens = [
      ...marketCapTokens,
      ...trendingTokens,
      ...volumeTokens,
      ...dexTokens,
      ...memeTokens,
      ...gamingTokens
    ];

    // Merge and process all tokens
    allTokens.forEach(token => {
      const existing = tokensToUpsert.get(token.symbol) || {
        symbol: token.symbol,
        name: token.name,
        token_type: [],
        chain: [],
        last_updated: new Date().toISOString()
      };

      // Update basic info
      if (token.market_cap_rank) existing.market_cap_rank = token.market_cap_rank;
      if (token.volume_rank) existing.volume_rank = token.volume_rank;
      if (token.trending_rank) existing.trending_rank = token.trending_rank;
      if (token.dex_rank) existing.dex_rank = token.dex_rank;
      if (token.dex_volume_24h) existing.dex_volume_24h = token.dex_volume_24h;
      if (token.dex_market_cap) existing.dex_market_cap = token.dex_market_cap;
      if (token.cmc_market_cap) existing.cmc_market_cap = token.cmc_market_cap;
      if (token.cmc_volume_24h) existing.cmc_volume_24h = token.cmc_volume_24h;
      if (token.cmc_price) existing.cmc_price = token.cmc_price;
      if (token.cmc_price_change_24h) existing.cmc_price_change_24h = token.cmc_price_change_24h;

      // Update token types
      if (token.token_type) {
        existing.token_type = [...new Set([...(existing.token_type || []), ...token.token_type])];
      }

      // Calculate trend signals
      const tokenWithSignals = calculateTrendSignals(existing);
      existing.trend_score = tokenWithSignals.trend_score;
      existing.trend_signals = tokenWithSignals.trend_signals;

      tokensToUpsert.set(token.symbol, existing);
    });

    stats.total_unique_tokens = tokensToUpsert.size;

    // Upsert all tokens
    const { error } = await supabaseClient
      .from('token_dictionary')
      .upsert(Array.from(tokensToUpsert.values()), {
        onConflict: 'symbol',
        ignoreDuplicates: false
      });

    if (error) {
      throw error;
    }

    console.log('Token dictionary cache update completed successfully');
    return {
      success: true,
      message: 'Token dictionary cache updated successfully',
      stats
    };
  } catch (error) {
    console.error('Error updating token dictionary cache:', error);
    return {
      success: false,
      message: `Error updating cache: ${error.message}`,
      stats: null
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Update token dictionary
    const result = await updateTokenDictionaryCache(supabaseClient);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error updating token dictionary:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error updating token dictionary',
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}); 