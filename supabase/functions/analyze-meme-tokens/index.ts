import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MemeTokenInfo {
  symbol: string;
  name: string;
  cmc_rank?: number;
  cmc_market_cap?: number;
  cmc_volume_24h?: number;
  cmc_price?: number;
  cmc_price_change_24h?: number;
  trend_score: number;
  meme_type?: 'dog' | 'cat' | 'pepe' | 'gaming' | 'ai' | 'celeb' | 'animal' | 'other';
  meme_subtype?: string;
  risk_level?: 'low' | 'medium' | 'high';
  social_metrics?: {
    twitter_mentions?: number;
    telegram_members?: number;
    discord_members?: number;
    community_growth?: number;
  };
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
      holder_distribution?: number;
      whale_concentration?: number;
    };
    historical_trends?: {
      price_trend?: number[];
      volume_trend?: number[];
      market_cap_trend?: number[];
      trend_direction?: 'up' | 'down' | 'sideways';
      trend_strength?: number;
      support_levels: number[];
      resistance_levels: number[];
    };
  };
  last_updated: string;
}

// Add type declarations for Deno
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Add type declarations for external modules
declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(url: string, key: string): any;
}

// Function to calculate meme-specific trend score
function calculateMemeTrendScore(token: any, historicalData: any): { trend_score: number; trend_signals: any; meme_type: string; meme_subtype: string } {
  const signals = {
    price_surge: false,
    volume_surge: false,
    momentum: 0,
    volatility: 0,
    market_signals: {
      price_acceleration: 0,
      volume_acceleration: 0,
      market_cap_growth: 0,
      liquidity_score: 0,
      holder_distribution: 0,
      whale_concentration: 0
    },
    historical_trends: {
      price_trend: historicalData?.price_trend || [],
      volume_trend: historicalData?.volume_trend || [],
      market_cap_trend: historicalData?.market_cap_trend || [],
      trend_direction: 'sideways',
      trend_strength: 0,
      support_levels: [],
      resistance_levels: []
    }
  };

  // Calculate trend score (0-100)
  let trend_score = 0;

  // Get token name and symbol
  const name = token.name.toLowerCase();
  const symbol = token.symbol.toUpperCase();

  // Enhanced meme type detection with more patterns and subcategories
  const memePatterns = {
    dog: {
      patterns: ['doge', 'shib', 'inu', 'wojak', 'floki', 'pup', 'bone', 'paw', 'bark', 'woof'],
      subtypes: {
        shiba: ['shib', 'inu', 'shiba'],
        doge: ['doge', 'doge'],
        floki: ['floki', 'viking'],
        other: ['pup', 'bone', 'paw']
      },
      multiplier: 1.2
    },
    pepe: {
      patterns: ['pepe', 'frog', 'meme', 'rare', 'pepo', 'peepo', 'kek', 'wojak', 'feels', 'rare'],
      subtypes: {
        classic: ['pepe', 'frog'],
        wojak: ['wojak', 'feels'],
        rare: ['rare', 'pepo', 'peepo'],
        other: ['kek', 'meme']
      },
      multiplier: 1.15
    },
    cat: {
      patterns: ['cat', 'kitty', 'meow', 'nyan', 'neko', 'purr', 'feline', 'pussy', 'whisker', 'paw'],
      subtypes: {
        nyan: ['nyan', 'rainbow'],
        neko: ['neko', 'japanese'],
        classic: ['cat', 'kitty', 'meow'],
        other: ['purr', 'feline']
      },
      multiplier: 1.1
    },
    gaming: {
      patterns: ['game', 'play', 'nft', 'metaverse', 'web3', 'gaming', 'play2earn', 'p2e', 'gamer', 'quest'],
      subtypes: {
        play2earn: ['play2earn', 'p2e', 'earn'],
        metaverse: ['meta', 'verse', 'virtual'],
        nft: ['nft', 'token'],
        other: ['game', 'play', 'gaming']
      },
      multiplier: 1.25
    },
    ai: {
      patterns: ['ai', 'gpt', 'chat', 'bot', 'neural', 'brain', 'smart', 'intelligence', 'robot', 'automation'],
      subtypes: {
        gpt: ['gpt', 'chat', 'bot'],
        neural: ['neural', 'brain', 'smart'],
        automation: ['robot', 'auto', 'bot'],
        other: ['ai', 'intelligence']
      },
      multiplier: 1.3
    },
    celeb: {
      patterns: ['elon', 'musk', 'trump', 'biden', 'kardashian', 'celebrity', 'star', 'famous', 'influencer', 'social'],
      subtypes: {
        tech: ['elon', 'musk', 'tech'],
        politics: ['trump', 'biden', 'political'],
        entertainment: ['kardashian', 'celebrity', 'star'],
        other: ['famous', 'influencer']
      },
      multiplier: 1.4
    },
    animal: {
      patterns: ['monkey', 'ape', 'bear', 'bull', 'tiger', 'lion', 'fox', 'wolf', 'dragon', 'phoenix'],
      subtypes: {
        primate: ['monkey', 'ape', 'gorilla'],
        predator: ['tiger', 'lion', 'wolf'],
        mythical: ['dragon', 'phoenix'],
        other: ['bear', 'bull', 'fox']
      },
      multiplier: 1.15
    },
    other: {
      patterns: ['moon', 'mars', 'safe', 'baby', 'rocket', 'chad', 'based', 'wojak', 'meme', 'token'],
      subtypes: {
        space: ['moon', 'mars', 'rocket'],
        safe: ['safe', 'baby', 'secure'],
        based: ['chad', 'based', 'wojak'],
        other: ['meme', 'token']
      },
      multiplier: 1.0
    }
  };

  // Determine meme type and subtype
  let memeType: 'dog' | 'cat' | 'pepe' | 'gaming' | 'ai' | 'celeb' | 'animal' | 'other' = 'other';
  let memeSubtype = 'other';
  let typeMultiplier = 1.0;

  // Check each category
  for (const [category, data] of Object.entries(memePatterns)) {
    if (data.patterns.some((pattern: string) => 
      name.includes(pattern) || 
      symbol.includes(pattern.toUpperCase())
    )) {
      memeType = category as any;
      typeMultiplier = data.multiplier;

      // Determine subtype
      for (const [subtype, patterns] of Object.entries(data.subtypes)) {
        if (patterns.some((pattern: string) => 
          name.includes(pattern) || 
          symbol.includes(pattern.toUpperCase())
        )) {
          memeSubtype = subtype;
          break;
        }
      }
      break;
    }
  }

  // Enhanced price surge detection with multiple timeframes
  const priceChange24h = token.quote?.USD?.percent_change_24h || 0;
  const priceChange7d = token.quote?.USD?.percent_change_7d || 0;
  const priceChange30d = token.quote?.USD?.percent_change_30d || 0;

  if (priceChange24h > 20 || priceChange7d > 50 || priceChange30d > 100) {
    signals.price_surge = true;
    trend_score += 25 * typeMultiplier;
  }

  // Enhanced volume analysis
  const volume24h = token.quote?.USD?.volume_24h || 0;
  const volume7d = token.quote?.USD?.volume_7d || 0;
  const avgVolume = volume24h / 24;
  const volumeGrowth = volume7d > 0 ? (volume24h - volume7d/7) / (volume7d/7) * 100 : 0;

  if (volume24h > avgVolume * 3 || volumeGrowth > 50) {
    signals.volume_surge = true;
    trend_score += 25 * typeMultiplier;
  }

  // Enhanced momentum calculation
  const priceChange = priceChange24h;
  const volumeChange = token.quote?.USD?.volume_change_24h || 0;
  signals.momentum = (priceChange + volumeChange) / 2;
  trend_score += Math.min(20, Math.abs(signals.momentum)) * typeMultiplier;

  // Enhanced volatility calculation with multiple timeframes
  const highPrice = token.quote?.USD?.high_24h || token.quote?.USD?.price;
  const lowPrice = token.quote?.USD?.low_24h || token.quote?.USD?.price;
  const avgPrice = (highPrice + lowPrice) / 2;
  signals.volatility = ((highPrice - lowPrice) / avgPrice) * 100;
  trend_score += Math.min(15, signals.volatility) * typeMultiplier;

  // Enhanced market signals
  const marketCap = token.quote?.USD?.market_cap || 0;
  
  // Price acceleration with multiple timeframes
  signals.market_signals.price_acceleration = (priceChange24h - priceChange7d/7) / 24;
  
  // Volume acceleration with multiple timeframes
  signals.market_signals.volume_acceleration = volumeGrowth / 24;
  
  // Enhanced market cap growth calculation
  signals.market_signals.market_cap_growth = (marketCap * priceChange24h) / 100;
  
  // Enhanced liquidity score with volume/market cap ratio
  signals.market_signals.liquidity_score = marketCap > 0 ? (volume24h / marketCap) * 100 : 0;

  // Calculate support and resistance levels from historical data
  if (historicalData?.price_trend?.length > 0) {
    const priceTrend = historicalData.price_trend;
    signals.historical_trends.support_levels = calculateSupportLevels(priceTrend);
    signals.historical_trends.resistance_levels = calculateResistanceLevels(priceTrend);
  }

  // Historical trend analysis with enhanced metrics
  if (historicalData) {
    const priceTrend = historicalData.price_trend || [];
    const volumeTrend = historicalData.volume_trend || [];
    const marketCapTrend = historicalData.market_cap_trend || [];

    // Calculate trend direction and strength with weighted components
    const priceDirection = calculateTrendDirection(priceTrend);
    const volumeDirection = calculateTrendDirection(volumeTrend);
    const marketCapDirection = calculateTrendDirection(marketCapTrend);

    // Weight the components (price: 50%, volume: 30%, market cap: 20%)
    const weightedDirection = (priceDirection * 0.5) + (volumeDirection * 0.3) + (marketCapDirection * 0.2);

    signals.historical_trends.trend_direction = 
      weightedDirection > 0.5 ? 'up' : 
      weightedDirection < -0.5 ? 'down' : 'sideways';

    signals.historical_trends.trend_strength = 
      Math.abs(priceDirection) + Math.abs(volumeDirection) + Math.abs(marketCapDirection);

    // Add historical trend bonus to score
    if (signals.historical_trends.trend_direction === 'up') {
      trend_score += 10 * typeMultiplier;
    }
  }

  return {
    trend_score: Math.min(100, trend_score),
    trend_signals: signals,
    meme_type: memeType,
    meme_subtype: memeSubtype
  };
}

// Helper function to calculate support levels
function calculateSupportLevels(prices: number[]): number[] {
  if (prices.length < 2) return [];
  
  const supportLevels: number[] = [];
  const windowSize = 5;
  
  for (let i = windowSize; i < prices.length - windowSize; i++) {
    const window = prices.slice(i - windowSize, i + windowSize);
    const currentPrice = prices[i];
    
    if (currentPrice === Math.min(...window)) {
      supportLevels.push(currentPrice);
    }
  }
  
  return supportLevels;
}

// Helper function to calculate resistance levels
function calculateResistanceLevels(prices: number[]): number[] {
  if (prices.length < 2) return [];
  
  const resistanceLevels: number[] = [];
  const windowSize = 5;
  
  for (let i = windowSize; i < prices.length - windowSize; i++) {
    const window = prices.slice(i - windowSize, i + windowSize);
    const currentPrice = prices[i];
    
    if (currentPrice === Math.max(...window)) {
      resistanceLevels.push(currentPrice);
    }
  }
  
  return resistanceLevels;
}

// Helper function to calculate trend direction
function calculateTrendDirection(values: number[]): number {
  if (values.length < 2) return 0;
  
  let sum = 0;
  for (let i = 1; i < values.length; i++) {
    sum += (values[i] - values[i-1]) / values[i-1];
  }
  return sum / (values.length - 1);
}

// Function to fetch meme tokens from CoinMarketCap
async function fetchMemeTokens(): Promise<MemeTokenInfo[]> {
  try {
    const CMC_API_KEY = Deno.env.get('CMC_API_KEY');
    if (!CMC_API_KEY) {
      console.error('CMC_API_KEY not found in environment variables');
      return [];
    }

    // Fetch top 500 tokens by market cap
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=500&convert=USD&aux=num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_market_cap_included_in_calc',
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid response format from CoinMarketCap:', JSON.stringify(data, null, 2));
      return [];
    }
    const tokens: MemeTokenInfo[] = [];

    // Process each token
    for (const coin of data.data) {
      const name = coin.name.toLowerCase();
      const symbol = coin.symbol.toUpperCase();
      
      // Check for meme token characteristics
      const isMeme = name.includes('meme') || 
                    name.includes('pepe') || 
                    name.includes('doge') || 
                    name.includes('shib') ||
                    name.includes('inu') ||
                    name.includes('elon') ||
                    name.includes('moon');
      
      if (isMeme) {
        // Fetch historical data from Supabase
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );

        const { data: historicalData } = await supabaseClient
          .from('token_history')
          .select('*')
          .eq('symbol', symbol)
          .order('timestamp', { ascending: false })
          .limit(24);

        // Calculate trend signals
        const { trend_score, trend_signals } = calculateMemeTrendScore(coin, {
          price_trend: historicalData?.map(d => d.price) || [],
          volume_trend: historicalData?.map(d => d.volume) || [],
          market_cap_trend: historicalData?.map(d => d.market_cap) || []
        });

        tokens.push({
          symbol,
          name: coin.name,
          cmc_rank: coin.cmc_rank,
          cmc_market_cap: coin.quote.USD.market_cap,
          cmc_volume_24h: coin.quote.USD.volume_24h,
          cmc_price: coin.quote.USD.price,
          cmc_price_change_24h: coin.quote.USD.percent_change_24h,
          trend_score,
          trend_signals,
          last_updated: new Date().toISOString()
        });
      }
    }

    // Sort by trend score
    return tokens.sort((a, b) => {
      const scoreA = a.trend_score * (a.cmc_market_cap || 0);
      const scoreB = b.trend_score * (b.cmc_market_cap || 0);
      return scoreB - scoreA;
    });
  } catch (error) {
    console.error('Error fetching meme tokens:', error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Fetch meme tokens
    const memeTokens = await fetchMemeTokens();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Meme tokens analyzed successfully',
        data: memeTokens,
        stats: {
          total_tokens: memeTokens.length,
          trending_tokens: memeTokens.filter(t => t.trend_score > 70).length,
          dog_coins: memeTokens.filter(t => t.meme_type === 'dog').length,
          pepe_coins: memeTokens.filter(t => t.meme_type === 'pepe').length,
          cat_coins: memeTokens.filter(t => t.meme_type === 'cat').length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Schedule the analysis to run once a day
setInterval(async () => {
  try {
    const memeTokens = await fetchMemeTokens();
    console.log('Meme tokens analyzed successfully.');
  } catch (error) {
    console.error('Error analyzing meme tokens:', error);
  }
}, 24 * 60 * 60 * 1000); // 24 hours in milliseconds 