# BlockLens

A real-time cryptocurrency dashboard built with React and TypeScript. Track live prices, analyze market trends, manage a watchlist, and get AI-powered trading insights — all in a dark, professional interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## Features

### Dashboard
- **Global Market Overview** — Spot volume, futures volume, open interest, and 24h liquidation data (longs & shorts).
- **Interactive Price Chart** — 7-day price history for any selected coin with smooth scrolling.
- **Live Coin Table** — Top 50 cryptocurrencies by market cap, sortable with real-time price updates every 60 seconds.
- **Watchlist Sidebar** — Add/remove coins to track. Click any coin to jump to its chart.

### AI Trading Assistant
- **One-click Analysis** — Get trend analysis and trading suggestions for any selected coin.
- **Smart Mock Engine** — Produces varied, realistic analysis based on actual price movements (API key handled server-side).

### Markets
- Full-width view of all 50 tracked coins with live stats.

### Portfolio
- Card-based view of your watchlisted assets.
- Total portfolio value calculation.
- Empty state with call-to-action to browse markets.

---

## Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Framework      | React 18 + TypeScript               |
| Styling        | CSS custom properties (dark theme)  |
| Charts         | Recharts                            |
| HTTP Client    | Axios                               |
| Icons          | Lucide React                        |
| Data Source    | CoinGecko API (free tier)           |

---

## Project Structure

```
  blocklens/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AIAssistant.tsx      # AI analysis panel
│   │   ├── CoinTable.tsx        # Sortable coin table
│   │   ├── MarketData.tsx       # Global market metrics
│   │   ├── Navbar.tsx           # Navigation bar with tabs
│   │   ├── PriceChart.tsx       # Recharts price history
│   │   └── Watchlist.tsx        # User watchlist sidebar
│   ├── hooks/
│   │   └── useWatchlist.ts      # Watchlist localStorage hook
│   ├── services/
│   │   └── api.ts               # CoinGecko API + AI analysis
│   ├── styles/
│   │   ├── AIAssistant.css
│   │   ├── App.css
│   │   ├── Chart.css
│   │   ├── MarketData.css
│   │   ├── Navbar.css
│   │   ├── Table.css
│   │   └── Watchlist.css
│   ├── types/
│   │   └── crypto.ts            # TypeScript interfaces
│   ├── App.tsx                  # Root component with tab routing
│   ├── index.tsx                # Entry point
│   └── index.css                # Global reset styles
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd blocklens

# Install dependencies
npm install
```

### Development

```bash
npm start
```

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will hot-reload when you make changes.

### Production Build

```bash
npm run build
```

Builds the app for production to the `build/` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### Testing

```bash
npm test
```

Launches the test runner in interactive watch mode.

---

## Available Scripts

| Command           | Description                                      |
|-------------------|--------------------------------------------------|
| `npm start`       | Runs the app in development mode                 |
| `npm run build`   | Builds the app for production                    |
| `npm test`        | Runs the test suite                              |
| `npm run eject`   | Ejects from Create React App (one-way operation) |

---

## API Configuration

The dashboard uses the **CoinGecko public API** (no key required) for market data and price history.

The **AI analysis** feature currently uses a built-in mock engine that generates realistic trading suggestions based on live price data. In production, the backend should handle the OpenAI API key — the frontend sends no keys.

---

## Design System

### Color Palette

| Token              | Hex       | Usage                    |
|--------------------|-----------|--------------------------|
| `--bg-primary`     | `#060610` | Page background          |
| `--bg-secondary`   | `#0c0c1d` | Card backgrounds         |
| `--bg-card`        | `#0f1023` | Panel surfaces           |
| `--accent`         | `#00ff88` | Positive/up indicators   |
| `--down`           | `#ff3b5c` | Negative/down indicators |
| `--purple`         | `#a855f7` | AI/insight highlights    |
| `--amber`          | `#ffaa00` | Warnings/disclaimers     |

### Typography

| Token             | Font Stack                                |
|-------------------|-------------------------------------------|
| `--font-heading`  | `'Outfit', 'Inter', sans-serif`           |
| `--font-body`     | `'Inter', sans-serif`                     |
| `--font-mono`     | `'JetBrains Mono', 'Consolas', monospace` |

---

## Tab Navigation

The navbar provides three tabs:

1. **Dashboard** — Full view with market overview, chart, coin table, AI assistant, and watchlist.
2. **Markets** — Dedicated full-width table of all tracked coins with summary stats.
3. **Portfolio** — Card grid of watchlisted coins with total value and individual metrics.

---

## License

MIT © 2026