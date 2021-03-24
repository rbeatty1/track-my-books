<template>
  <div id="total-book-summary">
    <p>
      <strong>{{ getFinishedBooksCount()}}</strong>
      Books
    </p>
    <p>
      <strong> {{ getTotalVocabWords() }}</strong>
      Vocabulary Words
    </p>
    <p>
      <strong>{{ getTotalPagesRead() }}</strong>
      Pages Read
    </p>
  </div>
</template>

<script>
import { calcPagesRead, formatNumber } from '@/util/Helpers';

export default {
  props: {
    booksData: Array,
  },
  methods: {
    getFinishedBooks() {
      return this.booksData.filter((b) => b.end);
    },
    getFinishedBooksCount() {
      return formatNumber(this.getFinishedBooks().length);
    },
    getTotalVocabWords() {
      return formatNumber(this.booksData.reduce((acc, cur) => acc + cur.wordCount, 0));
    },
    getTotalPagesRead() {
      return calcPagesRead(this.getFinishedBooks());
    },
  },
};
</script>
