<template>
<div class="book-card-nav-btns">
  <button
    :aria-label="'Toggle book cards ' + ((i - 1) * 4) + ' through ' + (((i - 1) * 4) + 4)"
    :class="[i == active ?  'active' : '']"
    @click="updateNavIdx(i)"
    v-for="i in count"
    :key="i"
    type="button"
  />
</div>
</template>

<script>
export default {
  props: {
    active: Number,
    count: Number,
    updateNavIdx: Function,
  },
};
</script>
