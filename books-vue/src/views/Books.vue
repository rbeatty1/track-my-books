<template>
  <div class="page-container" id="books-page">
    <NavBar/>
    <main>
      <LoadingIndicator :if="!loaded"/>
      <h1 :else="loaded">This will be the books page.</h1>
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Api from '@/util/Api';

export default {
  components: {
    NavBar,
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
        console.log(data);
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
