<template>
    <span id="book-rating-input">
      <input type="number" v-show="false" v-model="rating">
      <font-awesome-icon
        :class="[rating === 1 ? 'disabled' : '']"
        @click="adjustRating('decrease')"
        :icon="['fas', 'minus']"
      />
      <font-awesome-icon
        v-for="i of rating"
        :key="i"
        :icon="['fas', 'star']"
      />
      <font-awesome-icon
        :class="[rating === 5 ? 'disabled' : '']"
        @click="adjustRating('increase')"
        :icon="['fas', 'plus']"
      />
    </span>
</template>

<script>
export default {
  props: {
    propogateRatingValue: Function,
  },
  data() {
    return { rating: 1 };
  },
  methods: {
    adjustRating(direction) {
      if (direction === 'increase' && this.rating !== 5) this.rating += 1;
      if (direction === 'decrease' && this.rating !== 1) this.rating -= 1;
      this.propogateRatingValue(this.rating);
    },
  },
};
</script>
