<template>
  <div :class="['yearly-book-section', open ? 'active' : '']">
    <!--@TODO: OnClick => collapse -->
    <header class="yearly-book-section-header">
      <button
        type="button"
          :aria-controls="'book-details-'+year"
          @click="updateOpenIdx(year)"
      >
        <h1>{{ open ? '-' : '+'}} {{ year }}</h1>
      </button>
      <span class="yearly-book-section-summary">
        <span>
          <strong> {{ getCompletedBooks().length}} </strong>
          {{ getCompletedBooks().length > 1 ? 'Books' : 'Book' }} Completed
        </span>
        <span>
          <strong> {{ getPagesRead() }} </strong>
          Pages Read
        </span>
        <span v-if="activelyReading().length > 0">
          <strong> Currently Reading: </strong>
          {{ activelyReading()[0].title }}
        </span>
      </span>
    </header>
    <div
      :id="'book-details-'+year"
      :aria-hidden="!open"
      v-show="open"
    >
      <BookCardNav
        :active="activeNavIdx"
        :count="getNavBtnCount()"
        :updateNavIdx="updateNavIdx"
      />
      <div class="book-card-container">
        <BookCard
          v-for="b in getActiveBookCards()"
          :key="b.id"
          :data="b"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { calcPagesRead, getCurrentlyReading } from '@/util/Helpers';
import BookCardNav from './BookCardNav.vue';
import BookCard from './BookCard.vue';

export default {
  components: {
    BookCard,
    BookCardNav,
  },
  props: {
    booksData: Array,
    open: Boolean,
    year: Number,
    updateOpenIdx: Function,
  },
  data() {
    return {
      activeNavIdx: 1,
    };
  },
  methods: {
    activelyReading() {
      return getCurrentlyReading(this.booksData);
    },
    getActiveBookCards() {
      // book nav btns are not 0-indexed
      const startIdx = ((this.activeNavIdx - 1) * 4);
      const endIdx = startIdx + 4;
      return this.booksData.slice(startIdx, endIdx);
    },
    getCompletedBooks() {
      return this.booksData.filter((b) => b.end);
    },
    getNavBtnCount() {
      return Math.ceil(this.booksData.length / 4);
    },
    getPagesRead() {
      return calcPagesRead(this.getCompletedBooks());
    },
    updateNavIdx(newIdx) {
      this.activeNavIdx = newIdx;
    },
  },
};
</script>
