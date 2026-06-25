<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  loading: Boolean,
  suggestions: {
    type: Array,
    default: () => ['AAPL', 'TSLA', 'MSFT', 'BTC', 'ETH'],
  },
})

const emit = defineEmits(['search'])

const input = ref('')
let debounceTimer = null

function submit() {
  emit('search', input.value)
}

function onInput() {
  clearTimeout(debounceTimer)
  const trimmed = input.value.trim()
  if (trimmed.length < 2) return
  debounceTimer = setTimeout(() => {
    emit('search', input.value)
  }, 800)
}

function selectSuggestion(symbol) {
  input.value = symbol
  emit('search', symbol)
}

function setValue(value) {
  input.value = value
}

defineExpose({ setValue })
</script>

<template>
  <div class="search-bar">
    <form class="search-form" @submit.prevent="submit">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          v-model="input"
          type="text"
          class="search-input"
          placeholder="Search ticker — AAPL, TSLA, BTC..."
          autocomplete="off"
          spellcheck="false"
          :disabled="loading"
          @input="onInput"
        />
        <button type="submit" class="search-btn" :disabled="loading">
          <span v-if="loading" class="btn-spinner" />
          <span v-else>Search</span>
        </button>
      </div>
    </form>
    <div class="suggestions">
      <button
        v-for="s in suggestions"
        :key="s"
        class="suggestion-chip"
        :disabled="loading"
        @click="selectSuggestion(s)"
      >
        {{ s }}
      </button>
    </div>
  </div>
</template>
