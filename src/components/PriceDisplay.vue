<script setup>
import { formatPrice, formatChange, formatPercent } from '../utils/formatters.js'

defineProps({
  quote: Object,
  loading: Boolean,
})
</script>

<template>
  <div class="price-display">
    <template v-if="loading && !quote">
      <div class="skeleton skeleton-title" />
      <div class="skeleton skeleton-price" />
      <div class="skeleton skeleton-change" />
    </template>

    <template v-else-if="quote">
      <div class="price-header">
        <h2 class="ticker-symbol">{{ quote.symbol }}</h2>
        <span v-if="quote.isCrypto" class="asset-badge">Crypto</span>
        <span v-else class="asset-badge">Equity</span>
      </div>

      <div class="price-main">
        <span class="price-value">${{ formatPrice(quote.price, quote.price < 1 ? 4 : 2) }}</span>
        <span
          class="price-change"
          :class="quote.change >= 0 ? 'positive' : 'negative'"
        >
          {{ formatChange(quote.change) }}
          ({{ formatPercent(quote.changePercent) }})
        </span>
      </div>

      <p v-if="quote.latestTradingDay" class="price-meta">
        Last updated · {{ quote.latestTradingDay }}
      </p>
    </template>

    <template v-else>
      <div class="price-empty">
        <p class="empty-title">Market Dashboard</p>
        <p class="empty-subtitle">Search a ticker to view real-time market data</p>
      </div>
    </template>
  </div>
</template>
