const CRYPTO_TICKERS = new Set([
  'BTC', 'ETH', 'DOGE', 'SOL', 'ADA', 'XRP', 'DOT', 'AVAX',
  'MATIC', 'LINK', 'UNI', 'LTC', 'BCH', 'ATOM', 'XLM',
])

export function isCryptoTicker(ticker) {
  return CRYPTO_TICKERS.has(ticker.toUpperCase())
}

export function isValidTickerInput(value) {
  const trimmed = value.trim()
  return trimmed.length >= 1 && trimmed.length <= 10 && /^[A-Za-z0-9.-]+$/.test(trimmed)
}

export function formatPrice(value, decimals = 2) {
  const num = Number(value)
  if (Number.isNaN(num)) return '—'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatChange(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return '—'
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}`
}

export function formatPercent(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return '—'
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}%`
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatShortDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
