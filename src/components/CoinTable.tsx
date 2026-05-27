import React, { useState } from 'react';
import { Coin } from '../types/crypto';
import { Star } from 'lucide-react';
import '../styles/Table.css';

interface Props {
  coins: Coin[];
  onSelectCoin: (id: string) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

const CoinTable: React.FC<Props> = ({ coins, onSelectCoin, watchlist, onToggleWatchlist }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin; direction: 'asc' | 'desc' } | null>(null);

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
      <table>
        <thead>
          <tr>
            <th>Watch</th>
            <th onClick={() => requestSort('name')}>Asset</th>
            <th onClick={() => requestSort('current_price')}>Price</th>
            <th onClick={() => requestSort('price_change_percentage_24h')}>24h Change</th>
            <th onClick={() => requestSort('market_cap')}>Market Cap</th>
          </tr>
        </thead>
        <tbody>
  {sortedCoins.map(coin => (
    <tr key={coin.id} onClick={() => onSelectCoin(coin.id)}>
      <td onClick={(e) => { e.stopPropagation(); onToggleWatchlist(coin.id); }}>
        <Star className={watchlist.includes(coin.id) ? 'star-active' : 'star-inactive'} size={18} />
      </td>
      <td>
        <div className="asset-cell">
          <img src={coin.image} alt={coin.name} className="coin-icon" />
          <span>{coin.name}</span> <span className="symbol">{coin.symbol.toUpperCase()}</span>
        </div>
      </td>
      
      {/* Safety check for current_price */}
      <td>${coin.current_price?.toLocaleString() ?? 'N/A'}</td>

      {/* Safety check for percentage change */}
      <td className={(coin.price_change_percentage_24h ?? 0) > 0 ? 'text-up' : 'text-down'}>
        {coin.price_change_percentage_24h ? `${coin.price_change_percentage_24h.toFixed(2)}%` : '0.00%'}
      </td>

      {/* Safety check for market cap */}
      <td>${coin.market_cap?.toLocaleString() ?? 'N/A'}</td>
    </tr>
  ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;