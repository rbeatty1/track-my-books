<template>
  <div id="landing-page">
    <div id="landing-container">
      <h1>track-my-books</h1>
      <LoadingIndicator :if="!loaded"/>
      <span :else="loaded">
        <p>
          <strong>{{ getYearToDatePageTotal }}</strong> pages read this year
        </p>
        <p>
          <strong>Currently Reading:</strong> {{ getCurrentlyReading }}
        </p>
      </span>
      <ul>
        <li><a href="#/books">Books</a></li>
        <li><a href="#/vocabulary">Vocabulary</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import Api from '@/util/Api';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { formatNumber } from '@/util/Helpers';

export default {
  components: {
    LoadingIndicator,
  },
  name: 'Home',
  data() {
    return {
      loaded: false,
      data: null,
    };
  },
  created() {
    if (!this.loaded) {
      new Api({ endpoint: 'books' }).getData(this.getData);
    }
  },
  computed: {
    getYearToDatePageTotal() {
      if (this.data) {
        const currentYear = new Date().getFullYear();
        const booksThisYear = [...this.data]
          .filter((b) => new Date(b.start).getFullYear() === currentYear);
        const pages = booksThisYear.reduce((acc, cur) => acc + cur.pages, 0);
        return formatNumber(pages);
      }

      return 0;
    },
    getCurrentlyReading() {
      if (this.loaded) {
        const sorted = this.data
          .filter((b) => !b.end)
          .filter((b) => b.format !== 'Audiobook')
          .sort((a, b) => new Date(a.start) > new Date(b.start));

        return sorted.length > 0 ? sorted[0].title : 'Not readin\' nothing';
      }

      return 'Not readin\' nothing';
    },
  },
  methods: {
    getData(data) {
      if (data.success) {
        this.loaded = true;
        this.data = [...data.results];
      } else {
        this.loaded = false;
        this.data = data.results;
      }
    },
  },
};
</script>
