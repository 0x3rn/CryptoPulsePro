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