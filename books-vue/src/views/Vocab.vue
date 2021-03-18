<template>
  <div class='page-container' id='vocab-page'>
    <NavBar/>
    <LoadingIndicator v-if='!loaded'/>
    <main v-else>
      <VocabSidebar
        :filterType='filterType'
        :vocabData='data'
        :selectedFilterValue="selectedFilterValue"
        :updateFilterTypeAction="updateFilterType"
        :updateFilterValue="updateFilterValue"
      />
      <div id="vocab-page-content">
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import VocabSidebar from '@/components/VocabSidebar.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { VOCAB_GROUP_TYPES } from '@/util/Constants';
import Api from '@/util/Api';

export default {
  components: {
    LoadingIndicator,
    NavBar,
    VocabSidebar,
  },
  data() {
    return {
      api: new Api({ endpoint: 'vocab' }),
      data: null,
      filterType: VOCAB_GROUP_TYPES.GENRE,
      loaded: false,
      selectedFilterValue: 'All',
    };
  },
  created() {
    if (!this.loaded) {
      this.api.getData(this.resolveData);
    }
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
    updateFilterType(newVal) {
      this.selectedFilterValue = 'All';
      this.filterType = newVal;
    },
    updateFilterValue(newVal) {
      this.selectedFilterValue = newVal === this.selectedFilterValue ? 'All' : newVal;
    },
  },
};
</script>
