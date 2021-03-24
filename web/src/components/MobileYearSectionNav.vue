<template>
  <div id="mobile-year-section-nav">
    <h3>Jump to:</h3>
    <button
      type="button"
      :class="[openIdx === (idx) ? 'active' : '']"
      v-for="(year, idx) in years"
      :key="year"
      @click="updateOpenIdx(year)"
    >{{ year }}</button>
  </div>
</template>

<script>
export default {
  props: {
    openIdx: Number,
    updateOpenIdx: Function,
    years: Array,
  },
};
</script>
