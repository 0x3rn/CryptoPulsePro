import React, { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import CoinTable from './components/CoinTable';
import PriceChart from './components/PriceChart';
import Watchlist from './components/Watchlist';
import MarketData from './components/MarketData';
import AIAssistant from './components/AIAssistant';
import { fetchMarketData } from './services/api';
import { useWatchlist } from './hooks/useWatchlist';
import { Coin } from './types/crypto';
import { BarChart3, Briefcase, Sparkles } from 'lucide-react';
import './styles/App.css';

const App: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { watchlist, toggleWatchlist } = useWatchlist();

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchMarketData();
        setCoins(data);
      } catch (err) {
        console.error("Failed to fetch coins", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
    const interval = setInterval(getData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCoin = useCallback((id: string) => {
    setSelectedCoin(id);
    requestAnimationFrame(() => {
      chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  const selectedCoinData = coins.find(c => c.id === selectedCoin) || null;

  const renderDashboard = () => (
    <main className="app-container">
      <div className="main-content">
        <MarketData />
        <div ref={chartRef}>
          <PriceChart coinId={selectedCoin} />
        </div>
        <CoinTable
          coins={coins}
          onSelectCoin={handleSelectCoin}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      </div>
      <aside className="sidebar">
        <AIAssistant selectedCoin={selectedCoinData} />
        <Watchlist
          coins={coins}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          onSelectCoin={handleSelectCoin}
        />
      </aside>
    </main>
  );

  const renderAIAnalysis = () => (
    <main className="app-container">
      <div className="main-content">
        <div className="markets-header">
          <div className="markets-title-wrap">
            <div className="markets-icon portfolio-icon">
              <Sparkles size={28} />
            </div>
            <div>
              <h2>AI Trading Analysis</h2>
              <p>Select a coin and generate insights</p>
            </div>
          </div>
        </div>
        <AIAssistant selectedCoin={selectedCoinData} />
        <div ref={chartRef}>
          <PriceChart coinId={selectedCoin} />
        </div>
        <CoinTable
          coins={coins}
          onSelectCoin={handleSelectCoin}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      </div>
      <aside className="sidebar">
        <Watchlist
          coins={coins}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          onSelectCoin={handleSelectCoin}
        />
      </aside>
    </main>
  );

  const renderMarkets = () => (
    <main className="app-container app-container--wide">
      <div className="markets-header">
        <div className="markets-title-wrap">
          <BarChart3 size={28} className="markets-icon" />
          <div>
            <h2>Markets</h2>
            <p>Top 50 cryptocurrencies by market cap</p>
          </div>
        </div>
        <div className="markets-stats">
          <div className="markets-stat-item">
            <span className="stat-label">Total Coins</span>
            <span className="stat-value">{coins.length}</span>
          </div>
          <div className="markets-stat-item">
            <span className="stat-label">Watchlist</span>
            <span className="stat-value accent">{watchlist.length}</span>
          </div>
        </div>
      </div>
      <div className="full-width-table">
        <CoinTable
          coins={coins}
          onSelectCoin={handleSelectCoin}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
        />
      </div>
    </main>
  );

  const renderPortfolio = () => {
    const watchlistCoins = coins.filter(c => watchlist.includes(c.id));
    const totalValue = watchlistCoins.reduce((sum, c) => sum + (c.current_price || 0), 0);

    return (
      <main className="app-container app-container--wide">
        <div className="markets-header">
          <div className="markets-title-wrap">
            <Briefcase size={28} className="markets-icon portfolio-icon" />
            <div>
              <h2>Portfolio</h2>
              <p>Track your watchlisted assets</p>
            </div>
          </div>
          {watchlistCoins.length > 0 && (
            <div className="markets-stats">
              <div className="markets-stat-item">
                <span className="stat-label">Assets</span>
                <span className="stat-value">{watchlistCoins.length}</span>
              </div>
              <div className="markets-stat-item">
                <span className="stat-label">Total Value</span>
                <span className="stat-value accent">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
        </div>

        {watchlistCoins.length === 0 ? (
          <div className="portfolio-empty">
            <div className="empty-icon-wrap">
              <Sparkles size={48} className="empty-icon" />
            </div>
            <h3>Your portfolio is empty</h3>
            <p>Add coins to your watchlist by clicking the star icon on any coin in the Dashboard or Markets tab. Your selected assets and their total value will appear here.</p>
            <button className="portfolio-cta" onClick={() => setActiveTab('markets')}>
              Browse Markets
            </button>
          </div>
        ) : (
          <div className="portfolio-grid">
            {watchlistCoins.map(coin => (
              <div key={coin.id} className="portfolio-card" onClick={() => handleSelectCoin(coin.id)}>
                <div className="portfolio-card-top">
                  <img src={coin.image} alt={coin.name} className="portfolio-coin-img" />
                  <div className="portfolio-coin-info">
                    <span className="portfolio-coin-name">{coin.name}</span>
                    <span className="portfolio-coin-symbol">{coin.symbol?.toUpperCase()}</span>
                  </div>
                  <div className="portfolio-rank">#{coin.market_cap_rank}</div>
                </div>
                <div className="portfolio-card-price">
                  <span className="portfolio-price">${coin.current_price?.toLocaleString()}</span>
                  <span className={`portfolio-change ${(coin.price_change_percentage_24h ?? 0) >= 0 ? 'up' : 'down'}`}>
                    {(coin.price_change_percentage_24h ?? 0) >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                  </span>
                </div>
                <div className="portfolio-card-marketcap">
                  <span>Market Cap</span>
                  <span>${(coin.market_cap || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    );
  };

  return (
    <div className="dashboard-root">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'ai' && renderAIAnalysis()}
      {activeTab === 'markets' && renderMarkets()}
      {activeTab === 'portfolio' && renderPortfolio()}
      <footer className="site-footer">
        <p>Made with ❤️ by Somto Ike</p>
      </footer>
    </div>
  );
};

export default App;