import { ref } from 'vue'
import { fetchQuote, fetchDailyHistory, getErrorMessage } from './useAlphaVantage.js'
import { isValidTickerInput } from '../utils/formatters.js'
import { parseTimeSeriesDaily, parseCryptoDaily, calculateSMA, calculatePeriodChange } from '../utils/indicators.js'

const CACHE_KEY = 'stock-dashboard-last-ticker'

export function useStockData() {
  const ticker = ref('')
  const quote = ref(null)
  const history = ref([])
  const sma20 = ref([])
  const periodChange = ref({ absolute: 0, percent: 0 })
  const loading = ref(false)
  const error = ref(null)

  function loadCachedTicker() {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      ticker.value = cached
      return cached
    }
    return null
  }

  function cacheTicker(symbol) {
    localStorage.setItem(CACHE_KEY, symbol.toUpperCase())
  }

  async function search(symbol) {
    const trimmed = symbol.trim().toUpperCase()

    if (!trimmed) {
      error.value = getErrorMessage('EMPTY_INPUT')
      return
    }

    if (!isValidTickerInput(trimmed)) {
      error.value = getErrorMessage('INVALID_INPUT')
      return
    }

    loading.value = true
    error.value = null
    quote.value = null
    history.value = []
    sma20.value = []
    periodChange.value = { absolute: 0, percent: 0 }
    ticker.value = trimmed

    try {
      const quoteData = await fetchQuote(trimmed)
      quote.value = quoteData

      const historyResponse = await fetchDailyHistory(trimmed)
      const parsed = quoteData.isCrypto
        ? parseCryptoDaily(historyResponse)
        : parseTimeSeriesDaily(historyResponse)

      if (!parsed.length) {
        error.value = getErrorMessage('NO_DATA')
        return
      }

      history.value = parsed
      const closes = parsed.map((d) => d.close)
      sma20.value = calculateSMA(closes, 20)
      periodChange.value = calculatePeriodChange(closes)

      if (quoteData.isCrypto && parsed.length >= 2) {
        const prev = parsed[parsed.length - 2].close
        const curr = parsed[parsed.length - 1].close
        const change = curr - prev
        quote.value = {
          ...quoteData,
          price: curr,
          change,
          changePercent: prev !== 0 ? (change / prev) * 100 : 0,
          previousClose: prev,
        }
      }

      cacheTicker(trimmed)
    } catch (err) {
      error.value = getErrorMessage(err.message)
    } finally {
      loading.value = false
    }
  }

  return {
    ticker,
    quote,
    history,
    sma20,
    periodChange,
    loading,
    error,
    search,
    loadCachedTicker,
  }
}
