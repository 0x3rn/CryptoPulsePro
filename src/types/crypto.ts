export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string; thumb: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    market_cap_rank: number;
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    ath: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_date: { usd: string };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_90d?: number;
    price_change_percentage_180d?: number;
    price_change_percentage_1y: number;
    total_supply: number;
    circulating_supply: number;
    max_supply: number | null;
  };
}

export interface ChartData {
  timestamp: number;
  price: number;
}

export interface MarketMetrics {
  spotVolume24h: number;
  futuresVolume24h: number;
  openInterest: number;
  longLiquidations24h: number;
  shortLiquidations24h: number;
}
