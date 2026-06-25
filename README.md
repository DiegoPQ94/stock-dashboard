# Stock Dashboard

A clean, minimalist real-time financial dashboard built with Vue 3. Search any ticker — equities like AAPL or TSLA, or crypto like BTC — and view live market data alongside a historical price chart with basic technical indicators.

Designed as a portfolio-ready fintech project showcasing frontend engineering, financial data integration, and market visualization skills relevant to roles in financial technology and data-driven product development.

![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-ff6384)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff)

## Features

- **Ticker search** — equities (AAPL, TSLA, MSFT) and crypto (BTC, ETH)
- **Live price** — current price with daily change (absolute + percentage), color-coded green/red
- **Historical chart** — daily close line chart with 20-day SMA overlay
- **Basic indicators** — SMA 20, period percentage change, open/high/low/volume
- **Dark / light mode** — toggle with preference persistence
- **Error handling** — friendly messages for rate limits, invalid tickers, and network errors
- **UX extras** — skeleton loading, debounced search, last-ticker cache

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API) |
| Build tool | Vite 6 |
| Charts | Chart.js + vue-chartjs |
| Data source | Alpha Vantage API (direct frontend calls) |
| Styling | Custom CSS (no UI framework) |
| Deploy | Vercel / GitHub Pages |

## Getting Started

### Prerequisites

- Node.js 18+
- Alpha Vantage API key ([free signup](https://www.alphavantage.co/support/#api-key))

### Installation

```bash
git clone https://github.com/DiegoPQ94/stock-dashboard.git
cd stock-dashboard
npm install
```

### Environment Setup

Copy the example env file and add your API key:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_ALPHA_VANTAGE_KEY=your_actual_api_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

Output is in the `dist/` folder. Preview the production build:

```bash
npm run preview
```

## Alpha Vantage Integration

This app calls Alpha Vantage directly from the browser — no backend or proxy required.

| Endpoint | Function | Usage |
|----------|----------|-------|
| `GLOBAL_QUOTE` | Current stock price | Equities (AAPL, TSLA, etc.) |
| `TIME_SERIES_DAILY` | Daily OHLCV history | Stock chart data |
| `CRYPTO_EXCHANGE_RATE` | Current crypto price | BTC, ETH, etc. |
| `DIGITAL_CURRENCY_DAILY` | Daily crypto history | Crypto chart data |

**Free tier limits:** 25 requests/day, 5 requests/minute. The app detects rate-limit responses and shows a clear message instead of raw API errors.

Each ticker search uses 2 API calls (quote + history), so plan accordingly during development.

## Deployment

### Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variable: `VITE_ALPHA_VANTAGE_KEY` = your API key
4. Deploy — `vercel.json` is already configured

### GitHub Pages

1. Set `base` in `vite.config.js` to your repo name if needed:

```js
export default defineConfig({
  plugins: [vue()],
  base: '/stock-dashboard/',
})
```

2. Build and deploy:

```bash
npm run build
npx gh-pages -d dist
```

Or use GitHub Actions — add a workflow that runs `npm run build` and publishes `dist/` to the `gh-pages` branch.

3. Add `VITE_ALPHA_VANTAGE_KEY` as a repository secret or set it in the workflow env.

> **Note:** Environment variables are embedded at build time with Vite. For GitHub Pages, the API key will be visible in the client bundle. This is expected for a frontend-only demo — use a restricted API key and monitor usage on Alpha Vantage.

## Project Structure

```
src/
├── components/
│   ├── SearchBar.vue       # Ticker input with debounce & suggestions
│   ├── PriceDisplay.vue    # Current price and daily change
│   ├── MetricsPanel.vue    # OHLCV, SMA 20, period change
│   ├── StockChart.vue      # Line chart with SMA overlay
│   └── ErrorMessage.vue    # Friendly error display
├── composables/
│   ├── useAlphaVantage.js  # API calls and error mapping
│   └── useStockData.js     # Reactive state and search logic
├── utils/
│   ├── formatters.js       # Price, percent, date formatting
│   └── indicators.js       # SMA calculation, time series parsing
├── assets/
│   └── main.css            # Fintech design system
├── App.vue
└── main.js
```

## About

This project demonstrates skills directly relevant to financial technology roles — particularly experience aligned with Bloomberg-style market data workflows, real-time financial analytics, and clean data visualization.

It covers the full loop from external market data APIs to reactive UI state, chart rendering, and production deployment — all without a backend, showing how modern frontend tooling can deliver polished fintech experiences at low infrastructure cost.

## License

MIT
