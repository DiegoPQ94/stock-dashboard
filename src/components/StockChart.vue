<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { formatShortDate } from '../utils/formatters.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend)

const props = defineProps({
  history: Array,
  sma20: Array,
  ticker: String,
  loading: Boolean,
  isDark: Boolean,
})

const chartData = computed(() => {
  if (!props.history?.length) return null

  const labels = props.history.map((d) => formatShortDate(d.date))
  const closes = props.history.map((d) => d.close)

  return {
    labels,
    datasets: [
      {
        label: 'Close',
        data: closes,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 8,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'SMA 20',
        data: props.sma20,
        borderColor: '#f59e0b',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHitRadius: 8,
        tension: 0.3,
        fill: false,
        borderDash: [4, 4],
      },
    ],
  }
})

const chartOptions = computed(() => {
  const gridColor = props.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const textColor = props.isDark ? '#94a3b8' : '#64748b'

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: textColor,
          boxWidth: 12,
          boxHeight: 2,
          padding: 16,
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: props.isDark ? '#1e293b' : '#ffffff',
        titleColor: props.isDark ? '#f1f5f9' : '#0f172a',
        bodyColor: props.isDark ? '#94a3b8' : '#64748b',
        borderColor: props.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        padding: 12,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        callbacks: {
          label(ctx) {
            const val = ctx.parsed.y
            if (val == null) return null
            return `${ctx.dataset.label}: $${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: textColor,
          maxTicksLimit: 8,
          font: { family: 'Inter', size: 11 },
        },
        border: { display: false },
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        ticks: {
          color: textColor,
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (v) => '$' + v.toLocaleString(),
        },
        border: { display: false },
      },
    },
  }
})
</script>

<template>
  <div class="chart-container">
    <div v-if="loading && !history.length" class="chart-skeleton">
      <div class="skeleton skeleton-chart" />
    </div>

    <div v-else-if="chartData" class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <div v-else class="chart-empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
        <path d="M3 17 L9 11 L13 15 L21 7" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M21 7 V3 H17" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <p>Historical chart will appear here</p>
    </div>
  </div>
</template>
