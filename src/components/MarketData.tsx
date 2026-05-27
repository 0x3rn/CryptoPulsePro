import React, { useEffect, useState } from 'react';
import { fetchMarketMetrics } from '../services/api';
import { MarketMetrics } from '../types/crypto';
import '../styles/MarketData.css';

const MarketData: React.FC = () => {
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMetrics = async () => {
      const data = await fetchMarketMetrics();
      setMetrics(data);
      setLoading(false);
    };
    getMetrics();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  if (loading) {
    return <div className="market-data-panel loading">Loading Market Data...</div>;
  }

  if (!metrics) {
    return <div className="market-data-panel loading error">Market data temporarily unavailable.</div>;
  }

  return (
    <div className="market-data-panel">
      <h3 className="panel-title">Global Market Overview</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Spot Vol (24h)</span>
          <span className="metric-value">{formatCurrency(metrics.spotVolume24h)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Futures Vol (24h)</span>
          <span className="metric-value">{formatCurrency(metrics.futuresVolume24h)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Open Interest</span>
          <span className="metric-value">{formatCurrency(metrics.openInterest)}</span>
        </div>
        <div className="metric-card liq-card">
          <span className="metric-label">Liq. Longs (24h)</span>
          <span className="metric-value down">{formatCurrency(metrics.longLiquidations24h)}</span>
        </div>
        <div className="metric-card liq-card">
          <span className="metric-label">Liq. Shorts (24h)</span>
          <span className="metric-value up">{formatCurrency(metrics.shortLiquidations24h)}</span>
        </div>
      </div>
    </div>
  );
};

export default MarketData;
