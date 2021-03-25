<template>
  <div class="page-container" id="books-page">
    <NavBar/>
    <main>
      <LoadingIndicator v-if="!loaded"/>
      <span v-else>
        <BooksTotalSummary
          :booksData="data"
        />
        <MobileYearSectionNav
          :years="years"
          :openIdx="openIdx"
          :updateOpenIdx="updateOpenIdx"
        />
        <YearlyBookSection
          v-for="(year, idx) in years"
          :key="year"
          :booksData="getBooksByYear(year)"
          :year="year"
          :open="openIdx === idx"
          :updateOpenIdx="updateOpenIdx"
        />
      </span>
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import BooksTotalSummary from '@/components/BooksTotalSummary.vue';
import YearlyBookSection from '@/components/YearlyBookSection.vue';
import MobileYearSectionNav from '@/components/MobileYearSectionNav.vue';
import Api from '@/util/Api';

export default {
  components: {
    NavBar,
    BooksTotalSummary,
    MobileYearSectionNav,
    YearlyBookSection,
  },
  data() {
    return {
      api: new Api({ endpoint: 'books' }),
      data: null,
      isAdmin: localStorage.getItem('jwtAccessToken'),
      loaded: false,
      openIdx: 0,
      years: null,
    };
  },
  created() {
    if (!this.loaded) {
      this.api.getData(this.resolveData);
    }
  },
  methods: {
    getUniqueYears() {
      const bookYears = [...new Set(this.data.map((b) => new Date(b.start).getFullYear()))];
      return bookYears;
    },
    getBooksByYear(year) {
      return this.data.filter((b) => (b.end && new Date(b.end).getFullYear() === year)
        || (!b.end && new Date(b.start).getFullYear() === year));
    },
    resolveData(data) {
      if (data.success) {
        this.loaded = true;
        this.data = data.results;
        this.years = this.getUniqueYears();
      } else {
        this.loaded = false;
        this.data = data.results;
      }
    },
    updateOpenIdx(year) {
      const yearIdx = this.years.indexOf(year);
      this.openIdx = yearIdx === this.openIdx ? null : yearIdx;
    },
  },
};
</script>
