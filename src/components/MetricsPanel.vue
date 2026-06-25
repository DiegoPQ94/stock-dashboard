<script setup>
import { formatPrice, formatPercent } from '../utils/formatters.js'

const props = defineProps({
  quote: Object,
  periodChange: Object,
  sma20: Array,
  history: Array,
  loading: Boolean,
})

function currentSMA() {
  if (!props.sma20?.length || !props.history?.length) return null
  const last = props.sma20[props.sma20.length - 1]
  return last
}
</script>

<template>
  <div v-if="quote || loading" class="metrics-panel">
    <template v-if="loading && !quote">
      <div v-for="i in 4" :key="i" class="metric-card skeleton-card">
        <div class="skeleton skeleton-label" />
        <div class="skeleton skeleton-value" />
      </div>
    </template>

    <template v-else-if="quote">
      <div class="metric-card">
        <span class="metric-label">Open</span>
        <span class="metric-value">${{ formatPrice(quote.open) }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">High</span>
        <span class="metric-value positive">${{ formatPrice(quote.high) }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Low</span>
        <span class="metric-value negative">${{ formatPrice(quote.low) }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Prev Close</span>
        <span class="metric-value">${{ formatPrice(quote.previousClose) }}</span>
      </div>
      <div v-if="!quote.isCrypto" class="metric-card">
        <span class="metric-label">Volume</span>
        <span class="metric-value mono">{{ quote.volume.toLocaleString() }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">SMA 20</span>
        <span class="metric-value">
          {{ currentSMA() ? '$' + formatPrice(currentSMA()) : '—' }}
        </span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Period Change</span>
        <span
          class="metric-value"
          :class="periodChange.percent >= 0 ? 'positive' : 'negative'"
        >
          {{ formatPercent(periodChange.percent) }}
        </span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Data Points</span>
        <span class="metric-value mono">{{ history.length }} days</span>
      </div>
    </template>
  </div>
</template>
