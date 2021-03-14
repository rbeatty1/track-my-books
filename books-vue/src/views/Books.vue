<template>
  <div class="page-container" id="books-page">
    <NavBar/>
    <main>
      <LoadingIndicator v-if="!loaded"/>
      <BooksTotalSummary
        v-else
        :booksData="data"
      />
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import BooksTotalSummary from '@/components/BooksTotalSummary.vue';
import Api from '@/util/Api';

export default {
  components: {
    NavBar,
    BooksTotalSummary,
  },
  data() {
    return {
      loaded: false,
      data: null,
      api: new Api({ endpoint: 'books' }),
    };
  },
  created() {
    this.api.getData(this.resolveData);
  },
  methods: {
    resolveData(data) {
      if (data.success) {
        this.loaded = true;
        this.data = data.results;
      } else {
        this.loaded = false;
        this.data = data.results;
      }
    },
  },
};
</script>
