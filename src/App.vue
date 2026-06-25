<script setup>
import { ref, onMounted } from 'vue'
import SearchBar from './components/SearchBar.vue'
import PriceDisplay from './components/PriceDisplay.vue'
import MetricsPanel from './components/MetricsPanel.vue'
import StockChart from './components/StockChart.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import { useStockData } from './composables/useStockData.js'

const searchBarRef = ref(null)
const isDark = ref(true)

const {
  ticker,
  quote,
  history,
  sma20,
  periodChange,
  loading,
  error,
  search,
  loadCachedTicker,
} = useStockData()

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('stock-dashboard-theme', isDark.value ? 'dark' : 'light')
}

function handleSearch(symbol) {
  search(symbol)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('stock-dashboard-theme')
  if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.setAttribute('data-theme', 'dark')
  }

  const cached = loadCachedTicker()
  if (cached) {
    searchBarRef.value?.setValue(cached)
    search(cached)
  }
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-brand">
        <svg class="brand-icon" width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M6 24 L14 8 L18 16 L26 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div>
          <h1 class="brand-title">Stock Dashboard</h1>
          <p class="brand-subtitle">Real-time market intelligence</p>
        </div>
      </div>
      <button class="theme-toggle" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleTheme">
        <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </button>
    </header>

    <main class="main">
      <section class="section-search">
        <SearchBar ref="searchBarRef" :loading="loading" @search="handleSearch" />
        <ErrorMessage v-if="error" :message="error" />
      </section>

      <section class="section-price">
        <PriceDisplay :quote="quote" :loading="loading" />
      </section>

      <section class="section-metrics">
        <MetricsPanel
          :quote="quote"
          :period-change="periodChange"
          :sma20="sma20"
          :history="history"
          :loading="loading"
        />
      </section>

      <section class="section-chart">
        <div v-if="ticker && (history.length || loading)" class="chart-header">
          <h3 class="chart-title">{{ ticker }} — Daily Close</h3>
        </div>
        <StockChart
          :history="history"
          :sma20="sma20"
          :ticker="ticker"
          :loading="loading"
          :is-dark="isDark"
        />
      </section>
    </main>

    <footer class="footer">
      <p>Data provided by <a href="https://www.alphavantage.co/" target="_blank" rel="noopener">Alpha Vantage</a></p>
      <p class="footer-note">Free tier: 25 requests/day · 5 requests/min</p>
    </footer>
  </div>
</template>
