import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Bot, AlertTriangle, TrendingUp, Activity, Layers } from 'lucide-react';
import { fetchCoinDetail, fetchCoinHistory, generateAIAnalysis } from '../services/api';
import { CoinDetail as CoinDetailType } from '../types/crypto';
import PriceChart from './PriceChart';
import '../styles/CoinDetail.css';

const CoinDetailPage: React.FC = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const navigate = useNavigate();
  const aiSectionRef = useRef<HTMLDivElement>(null);
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string>('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  // Pre-fetch chart data for AI analysis
  const chartData7dRef = useRef<{ timestamp: number; price: number }[]>([]);
  const chartData30dRef = useRef<{ timestamp: number; price: number }[]>([]);
  const chartData1yRef = useRef<{ timestamp: number; price: number }[]>([]);

  useEffect(() => {
    if (!coinId) return;
    const loadChartData = async () => {
      try {
        const [data7d, data30d, data1y] = await Promise.all([
          fetchCoinHistory(coinId, 7),
          fetchCoinHistory(coinId, 30),
          fetchCoinHistory(coinId, 365),
        ]);
        chartData7dRef.current = data7d;
        chartData30dRef.current = data30d;
        chartData1yRef.current = data1y;
      } catch (err) {
        console.error('Failed to pre-fetch chart data for AI', err);
      }
    };
    loadChartData();
  }, [coinId]);

  const scrollToAIAnalysis = () => {
    aiSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!coinId) return;
    const loadCoin = async () => {
      setLoading(true);
      try {
        const data = await fetchCoinDetail(coinId);
        setCoin(data);
      } catch (err) {
        console.error('Failed to fetch coin detail', err);
      } finally {
        setLoading(false);
      }
    };
    loadCoin();
  }, [coinId]);

  const handleAnalyze = useCallback(async () => {
    if (!coin) return;
    setAnalysisLoading(true);
    setAnalysis('');
    try {
      const result = await generateAIAnalysis(
        coin.name,
        coin.market_data.current_price.usd,
        coin.market_data.price_change_percentage_24h,
        chartData7dRef.current,
        chartData30dRef.current,
        chartData1yRef.current
      );
      setAnalysis(result);
    } catch (err) {
      setAnalysis('Error generating analysis. Please try again later.');
    } finally {
      setAnalysisLoading(false);
    }
  }, [coin]);

  const formatCurrency = (value: number | null | undefined): string => {
    if (value == null) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (value: number | null | undefined): { text: string; className: string } => {
    if (value == null) return { text: 'N/A', className: '' };
    const isUp = value >= 0;
    return {
      text: `${isUp ? '+' : ''}${value.toFixed(2)}%`,
      className: isUp ? 'up' : 'down',
    };
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading Coin Data...</div>;
  }

  if (!coin) {
    return (
      <div className="coin-detail-wrapper">
        <div className="coin-detail-container">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <div className="loading">Coin not found.</div>
        </div>
      </div>
    );
  }

  const { market_data } = coin;

  const priceChanges = [
    { label: '24 Hours', value: market_data.price_change_percentage_24h },
    { label: '7 Days', value: market_data.price_change_percentage_7d },
    { label: '30 Days', value: market_data.price_change_percentage_30d },
    { label: '90 Days', value: market_data.price_change_percentage_90d },
    { label: '180 Days', value: market_data.price_change_percentage_180d },
    { label: '1 Year', value: market_data.price_change_percentage_1y },
  ];

  const supplyInfo = [
    { label: 'Circulating Supply', value: market_data.circulating_supply },
    { label: 'Total Supply', value: market_data.total_supply },
    { label: 'Max Supply', value: market_data.max_supply },
  ];

  const highlights = [
    { label: 'Market Cap Rank', value: `#${market_data.market_cap_rank}` },
    { label: 'Market Cap', value: formatCurrency(market_data.market_cap.usd) },
    { label: '24h Volume', value: formatCurrency(market_data.total_volume.usd) },
    { label: 'All-Time High', value: formatCurrency(market_data.ath.usd) },
    { label: 'ATH Date', value: formatDate(market_data.ath_date.usd) },
    { label: 'All-Time Low', value: formatCurrency(market_data.atl.usd) },
    { label: 'ATL Date', value: formatDate(market_data.atl_date.usd) },
  ];

  return (
    <div className="coin-detail-wrapper">
      <div className="coin-detail-container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {/* Top Nav Links */}
        <div className="coin-detail-nav">
          <button className="ai-nav-link" onClick={scrollToAIAnalysis}>
            <Bot size={16} />
            AI-Analysis
          </button>
        </div>

        {/* Header */}
        <div className="coin-detail-header">
          <div className="coin-detail-identity">
            <img src={coin.image.large} alt={coin.name} className="coin-detail-img" />
            <div>
              <h1>{coin.name} <span className="coin-detail-symbol">{coin.symbol.toUpperCase()}</span></h1>
            </div>
          </div>
          <div className="coin-detail-price">
            <span className="detail-current-price">
              {formatCurrency(market_data.current_price.usd)}
            </span>
            <span className={`detail-price-change ${formatPercent(market_data.price_change_percentage_24h).className}`}>
              {formatPercent(market_data.price_change_percentage_24h).text}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="coin-detail-chart-section">
          <PriceChart coinId={coinId!} />
        </div>

        {/* Price Changes Grid */}
        <div className="coin-detail-section">
          <div className="section-header">
            <TrendingUp size={18} className="section-icon" />
            <h2>Price Change Percentages</h2>
          </div>
          <div className="price-changes-grid">
            {priceChanges.map((pc) => {
              const fmt = formatPercent(pc.value);
              return (
                <div key={pc.label} className="price-change-card">
                  <span className="pc-label">{pc.label}</span>
                  <span className={`pc-value ${fmt.className}`}>{fmt.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coin Highlights */}
        <div className="coin-detail-section">
          <div className="section-header">
            <Activity size={18} className="section-icon" />
            <h2>Coin Highlights</h2>
          </div>
          <div className="highlights-grid">
            {highlights.map((h) => (
              <div key={h.label} className="highlight-card">
                <span className="highlight-label">{h.label}</span>
                <span className="highlight-value">{h.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supply Info */}
        <div className="coin-detail-section">
          <div className="section-header">
            <Layers size={18} className="section-icon" />
            <h2>Supply Information</h2>
          </div>
          <div className="supply-grid">
            {supplyInfo.map((s) => (
              <div key={s.label} className="supply-card">
                <span className="supply-label">{s.label}</span>
                <span className="supply-value">
                  {s.value != null ? s.value.toLocaleString() : '∞'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="coin-detail-section" ref={aiSectionRef}>
          <div className="section-header">
            <Bot size={18} className="section-icon ai-icon" />
            <h2>AI Trading Analysis</h2>
          </div>
          <div className="ai-analysis-card">
            <div className="disclaimer-alert">
              <AlertTriangle size={16} className="warning-icon" />
              <p><strong>Disclaimer:</strong> AI suggestions are for informational purposes only and do not constitute financial advice. Trading crypto involves significant risk.</p>
            </div>
            <div className="ai-action">
              <p>Ready to analyze <strong>{coin.name}</strong> based on current trends and sentiment.</p>
              <button className="analyze-btn" onClick={handleAnalyze} disabled={analysisLoading}>
                {analysisLoading ? 'Analyzing...' : 'Generate AI Analysis'}
              </button>
            </div>
            {analysis && (
              <div className="ai-result">
                <h4>Analysis Result:</h4>
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailPage;