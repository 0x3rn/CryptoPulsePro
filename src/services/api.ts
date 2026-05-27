import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchMarketData = async () => {
  const response = await axios.get(`${BASE_URL}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page: 1,
      sparkline: false,
    },
  });
  return response.data;
};

export const fetchCoinHistory = async (coinId: string, days: number = 7) => {
  const response = await axios.get(`${BASE_URL}/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days: days,
    },
  });
  // Transform [timestamp, price] array into object array for Recharts
  return response.data.prices.map((price: [number, number]) => ({
    timestamp: price[0],
    price: price[1],
  }));
};

export const fetchMarketMetrics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/global`);
    const globalData = response.data.data;
    const spotVolume = globalData.total_volume.usd;

    // Simulate Futures and Liquidations based on spot volume for demonstration
    // Real-time liquidation APIs require premium keys or websocket feeds.
    const futuresVolume = spotVolume * 1.8; // Futures volume is typically higher
    const openInterest = futuresVolume * 0.15;
    const longLiq = (spotVolume * 0.002) * (0.3 + Math.random() * 0.7);
    const shortLiq = (spotVolume * 0.002) * (0.3 + Math.random() * 0.7);

    return {
      spotVolume24h: spotVolume,
      futuresVolume24h: futuresVolume,
      openInterest: openInterest,
      longLiquidations24h: longLiq,
      shortLiquidations24h: shortLiq,
    };
  } catch (err) {
    console.error("Failed to fetch global metrics", err);
    return null;
  }
};

export const generateAIAnalysis = async (coinName: string, price: number, change: number) => {
  // Server-side analysis — API key is handled on the backend in production.
  // For now, we generate a smart mock analysis based on real price data.
  await new Promise(res => setTimeout(res, 1500));
  const trend = change >= 0 ? "bullish" : "bearish";
  const strength = Math.abs(change) > 5 ? "strong" : Math.abs(change) > 2 ? "moderate" : "mild";
  const suggestions = change >= 0
    ? [
        `Momentum is building — consider scaling in with tight stops below recent support.`,
        `Uptrend appears healthy. Look for pullbacks to key moving averages as entry points.`,
        `Volume profile suggests accumulation. A breakout above resistance could trigger further upside.`,
      ]
    : [
        `Downtrend pressure remains. Wait for a confirmed reversal pattern before entering.`,
        `Bearish sentiment dominating. Consider hedging or reducing exposure until trend clarifies.`,
        `Price is testing support levels. A bounce from here could present a swing trade opportunity.`,
      ];
  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

  return `${coinName} is exhibiting a ${strength} ${trend} bias with a 24h change of ${change.toFixed(2)}%. Current price: $${price.toLocaleString()}.\n\nAnalysis: ${randomSuggestion}\n\nRisk Level: ${Math.abs(change) > 5 ? 'High' : Math.abs(change) > 2 ? 'Medium' : 'Low'} — always size positions accordingly.`;
};
