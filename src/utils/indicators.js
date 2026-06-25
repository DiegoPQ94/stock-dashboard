export function calculateSMA(data, period = 20) {
  const result = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null)
    } else {
      const slice = data.slice(i - period + 1, i + 1)
      const sum = slice.reduce((acc, val) => acc + val, 0)
      result.push(sum / period)
    }
  }
  return result
}

export function calculatePeriodChange(data) {
  if (!data.length) return { absolute: 0, percent: 0 }
  const first = data[0]
  const last = data[data.length - 1]
  const absolute = last - first
  const percent = first !== 0 ? (absolute / first) * 100 : 0
  return { absolute, percent }
}

export function parseTimeSeriesDaily(response, maxDays = 100) {
  const series = response['Time Series (Daily)']
  if (!series) return []

  const entries = Object.entries(series)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-maxDays)

  return entries.map(([date, values]) => ({
    date,
    close: parseFloat(values['4. close']),
    open: parseFloat(values['1. open']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    volume: parseInt(values['5. volume'], 10),
  }))
}

export function parseCryptoDaily(response, maxDays = 100) {
  const series = response['Time Series (Digital Currency Daily)']
  if (!series) return []

  const entries = Object.entries(series)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-maxDays)

  return entries.map(([date, values]) => ({
    date,
    close: parseFloat(values['4a. close (USD)'] || values['4. close']),
    open: parseFloat(values['1a. open (USD)'] || values['1. open']),
    high: parseFloat(values['2a. high (USD)'] || values['2. high']),
    low: parseFloat(values['3a. low (USD)'] || values['3. low']),
    volume: parseFloat(values['5. volume'] || values['6. volume'] || 0),
  }))
}
