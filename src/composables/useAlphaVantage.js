import { isCryptoTicker } from '../utils/formatters.js'

const BASE_URL = 'https://www.alphavantage.co/query'

function getApiKey() {
  const key = import.meta.env.VITE_ALPHA_VANTAGE_KEY
  if (!key || key === 'your_api_key_here') {
    throw new Error('API_KEY_MISSING')
  }
  return key
}

function parseApiError(data) {
  if (data.Note) {
    return 'RATE_LIMIT'
  }
  if (data.Information) {
    if (data.Information.toLowerCase().includes('rate limit') ||
        data.Information.toLowerCase().includes('frequency')) {
      return 'RATE_LIMIT'
    }
    return 'API_ERROR'
  }
  if (data['Error Message']) {
    return 'INVALID_TICKER'
  }
  return null
}

async function fetchAlphaVantage(params) {
  const apiKey = getApiKey()
  const url = new URL(BASE_URL)
  Object.entries({ ...params, apikey: apiKey }).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  try {
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error('NETWORK_ERROR')
    }
    const data = await response.json()
    const apiError = parseApiError(data)
    if (apiError) {
      throw new Error(apiError)
    }
    return data
  } catch (err) {
    if (err.message === 'API_KEY_MISSING' ||
        err.message === 'RATE_LIMIT' ||
        err.message === 'INVALID_TICKER' ||
        err.message === 'API_ERROR') {
      throw err
    }
    throw new Error('NETWORK_ERROR')
  }
}

export async function fetchGlobalQuote(symbol) {
  const data = await fetchAlphaVantage({
    function: 'GLOBAL_QUOTE',
    symbol,
  })

  const quote = data['Global Quote']
  if (!quote || !quote['05. price'] || quote['05. price'] === '0.0000') {
    throw new Error('INVALID_TICKER')
  }

  const changePercent = quote['10. change percent']?.replace('%', '') ?? '0'

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(changePercent),
    previousClose: parseFloat(quote['08. previous close']),
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    volume: parseInt(quote['06. volume'], 10),
    latestTradingDay: quote['07. latest trading day'],
    isCrypto: false,
  }
}

export async function fetchCryptoQuote(symbol) {
  const data = await fetchAlphaVantage({
    function: 'CRYPTO_EXCHANGE_RATE',
    symbol,
    market: 'USD',
  })

  const rate = data['Realtime Currency Exchange Rate']
  if (!rate || !rate['5. Exchange Rate']) {
    throw new Error('INVALID_TICKER')
  }

  const price = parseFloat(rate['5. Exchange Rate'])
  const bid = parseFloat(rate['8. Bid Price'] || price)
  const ask = parseFloat(rate['9. Ask Price'] || price)
  const change = ask - bid

  return {
    symbol: rate['1. From_Currency Code'],
    price,
    change,
    changePercent: bid !== 0 ? (change / bid) * 100 : 0,
    previousClose: bid,
    open: bid,
    high: Math.max(bid, ask),
    low: Math.min(bid, ask),
    volume: 0,
    latestTradingDay: rate['6. Last Refreshed']?.split(' ')[0] ?? '',
    isCrypto: true,
  }
}

export async function fetchQuote(symbol) {
  const upper = symbol.toUpperCase()
  if (isCryptoTicker(upper)) {
    return fetchCryptoQuote(upper)
  }
  return fetchGlobalQuote(upper)
}

export async function fetchDailyHistory(symbol) {
  const upper = symbol.toUpperCase()

  if (isCryptoTicker(upper)) {
    return fetchAlphaVantage({
      function: 'DIGITAL_CURRENCY_DAILY',
      symbol: upper,
      market: 'USD',
    })
  }

  return fetchAlphaVantage({
    function: 'TIME_SERIES_DAILY',
    symbol: upper,
    outputsize: 'compact',
  })
}

export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'API key not configured. Add your Alpha Vantage key to the .env file.',
  RATE_LIMIT: 'API rate limit reached. The free tier allows 25 requests per day and 5 per minute. Please wait a moment and try again.',
  INVALID_TICKER: 'Ticker not found. Try a valid symbol like AAPL, TSLA, or BTC.',
  NETWORK_ERROR: 'Unable to connect. Check your internet connection and try again.',
  EMPTY_INPUT: 'Enter a ticker symbol to search.',
  INVALID_INPUT: 'Invalid ticker format. Use letters and numbers only (e.g. AAPL, BTC).',
  NO_DATA: 'No market data available for this ticker.',
}

export function getErrorMessage(code) {
  return ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.'
}
