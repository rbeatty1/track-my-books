<template>
  <div class="book-card">
    <header>
      <strong> {{ data.title }}</strong>
      <span> {{ data.author }}</span>
    </header>
    <article>
      <div class="book-card-details">
        <span v-if="data.end !== null">
          Finished on
            <strong>
              {{
                new Date(data.end)
                  .toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric' }
                  )
              }}
            </strong>
        </span>
        <strong v-else>Currently {{
            data.format !== "Audiobook" ?
              'Reading' :
              'Listening'
            }}</strong>
        <span>{{ getFormattedPages() }} pg.</span>
      </div>
      <div class="book-card-details">
        <span>{{ calcDaysSpendReading() }} days to read</span>
        <span>{{ calcPagesPerDay() }} pg/day</span>
      </div>
      <div
        class="book-details-icons"
      >
        <font-awesome-icon
          :icon="['fas', getFormatIconClass()]"
          :title="data.format"
        ></font-awesome-icon>
        <span
          class="book-ratings"
          v-if="data.end"
          :title="data.rating + ' stars!'"
        >
          <font-awesome-icon
            :icon="['fas', 'star']"
            v-for="i in data.rating"
            :key="i"
          ></font-awesome-icon>
        </span>
        <font-awesome-icon
          @click="toggleBookModal('edit', data)"
          :icon="['fas', 'pencil-alt']"
          v-else
        />
      </div>
    </article>
  </div>
</template>

<script>
import { formatNumber } from '@/util/Helpers';

export default {
  props: {
    data: Object,
    toggleBookModal: Function,
  },
  data() {
    return {
      isAdmin: localStorage.getItem('jwtAccessToken') !== null,
    };
  },
  methods: {
    calcDaysSpendReading() {
      const startDt = new Date(this.data.start);
      const endDt = this.data.end ? new Date(this.data.end) : new Date();
      const diffDays = Math.ceil(Math.abs(endDt - startDt) / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    calcPagesPerDay() {
      return Math.round(
        this.data.pages
        / (this.calcDaysSpendReading() === 0
          ? 1
          : this.calcDaysSpendReading()),
      );
    },
    getFormatIconClass() {
      let formatIconClass = '';
      switch (this.data.format) {
        case 'Audiobook':
          formatIconClass = 'headphones';
          break;
        case 'E-Book':
          formatIconClass = 'tablet-alt';
          break;
        default:
          formatIconClass = 'book';
          break;
      }
      return formatIconClass;
    },
    getFormattedPages() {
      return formatNumber(this.data.pages);
    },
  },
};
</script>
