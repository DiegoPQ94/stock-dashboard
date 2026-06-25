<script setup>
defineProps({
  message: String,
})
</script>

<template>
  <div class="error-message" role="alert">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" stroke-linecap="round" />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>
