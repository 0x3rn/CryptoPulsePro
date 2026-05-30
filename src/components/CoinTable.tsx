import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coin } from '../types/crypto';
import { Star } from 'lucide-react';
import '../styles/Table.css';

interface Props {
  coins: Coin[];
  onSelectCoin?: (id: string) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

const formatMarketCap = (mc: number): string => {
  if (mc >= 1e12) return `$${(mc / 1e12).toFixed(2)}T`;
  if (mc >= 1e9) return `$${(mc / 1e9).toFixed(2)}B`;
  if (mc >= 1e6) return `$${(mc / 1e6).toFixed(2)}M`;
  return `$${mc.toLocaleString()}`;
};

const CoinTable: React.FC<Props> = ({ coins, onSelectCoin, watchlist, onToggleWatchlist }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin; direction: 'asc' | 'desc' } | null>(null);

  const handleRowClick = (coinId: string) => {
    if (onSelectCoin) {
      onSelectCoin(coinId);
    } else {
      navigate(`/coin/${coinId}`);
    }
  };

  const sortedCoins = [...(coins ?? [])].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof Coin) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="col-watch"><Star size={14} /></th>
              <th onClick={() => requestSort('name')} className="col-asset">Asset</th>
              <th onClick={() => requestSort('current_price')} className="col-price">Price</th>
              <th onClick={() => requestSort('price_change_percentage_24h')} className="col-change">24h</th>
              <th onClick={() => requestSort('market_cap')} className="col-mcap-desk">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map(coin => (
              <tr key={coin.id} onClick={() => handleRowClick(coin.id)}>
                <td className="col-watch" onClick={(e) => { e.stopPropagation(); onToggleWatchlist(coin.id); }}>
                  <Star className={watchlist.includes(coin.id) ? 'star-active' : 'star-inactive'} size={16} />
                </td>
                <td className="col-asset">
                  <div className="asset-cell">
                    <img src={coin.image} alt={coin.name} className="coin-icon" />
                    <div className="asset-text">
                      <span className="asset-name">{coin.name}</span>
                      <span className="asset-symbol">{coin.symbol?.toUpperCase()}</span>
                      <span className="asset-mcap-mobile">{formatMarketCap(coin.market_cap || 0)}</span>
                    </div>
                  </div>
                </td>
                <td className="col-price">${coin.current_price?.toLocaleString() ?? 'N/A'}</td>
                <td className={`col-change ${(coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-up' : 'text-down'}`}>
                  {coin.price_change_percentage_24h != null ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%` : '0.00%'}
                </td>
                <td className="col-mcap-desk">${coin.market_cap?.toLocaleString() ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinTable;