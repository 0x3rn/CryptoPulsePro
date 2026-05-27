import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { fetchCoinHistory } from '../services/api';
import '../styles/Chart.css';

interface Props {
  coinId: string;
}

const PriceChart: React.FC<Props> = ({ coinId }) => {
  const [data, setData] = useState<any[]>([]);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchCoinHistory(coinId, days)
      .then(setData)
      .catch(() => setData([]));
  }, [coinId, days]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2>Price History: <span className="coin-label">{coinId.toUpperCase()}</span></h2>
        <div className="time-filters">
          {[7, 30, 365].map(d => (
            <button key={d} onClick={() => setDays(d)} className={days === d ? 'active' : ''}>
              {d === 365 ? '1Y' : `${d}D`}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="timestamp" 
              hide={true}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(val) => `$${val.toLocaleString()}`} 
              tick={{ fontSize: 11, fill: '#6b7094', fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              width={75}
            />
            <Tooltip 
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              formatter={(value: any) => {
                const numericValue = typeof value === 'number' ? value : 0;
                return [`$${numericValue.toLocaleString()}`, 'Price'];
              }}
              contentStyle={{ 
                backgroundColor: '#0c0c1d', 
                border: '1px solid rgba(0, 255, 136, 0.15)', 
                borderRadius: '10px',
                color: '#e8eaf0',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.82rem',
                padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
              cursor={{ stroke: 'rgba(0, 255, 136, 0.2)', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#00ff88" 
              strokeWidth={2} 
              fill="url(#priceGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;