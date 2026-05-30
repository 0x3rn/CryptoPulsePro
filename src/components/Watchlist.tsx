import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coin } from '../types/crypto';
import { Trash2 } from 'lucide-react';
import '../styles/Watchlist.css';

interface Props {
  coins: Coin[];
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  onSelectCoin?: (id: string) => void;
}

const Watchlist: React.FC<Props> = ({ coins, watchlist, onToggleWatchlist, onSelectCoin }) => {
  const navigate = useNavigate();
  const watchlistCoins = (coins ?? []).filter(coin => watchlist.includes(coin.id));

  const handleItemClick = (coinId: string) => {
    if (onSelectCoin) {
      onSelectCoin(coinId);
    } else {
      navigate(`/coin/${coinId}`);
    }
  };

  return (
    <div className="watchlist-container">
      <h3 className="watchlist-title">Your Watchlist</h3>
      {watchlistCoins.length === 0 ? (
        <div className="empty-state">
          <p>No coins added yet. Click the star on the table to track assets.</p>
        </div>
      ) : (
        <div className="watchlist-items">
          {watchlistCoins.map(coin => (
            <div key={coin.id} className="watchlist-item" onClick={() => handleItemClick(coin.id)}>
              <img src={coin.image} alt={coin.name} className="coin-icon-small" />
              <div className="coin-info">
                <span className="coin-name">{coin.name}</span>
                <span className={`coin-price ${(coin.price_change_percentage_24h ?? 0) >= 0 ? 'up' : 'down'}`}>
                  ${coin.current_price?.toLocaleString() ?? 'N/A'}
                </span>
              </div>
              <button 
                className="remove-btn" 
                onClick={(e) => { e.stopPropagation(); onToggleWatchlist(coin.id); }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;