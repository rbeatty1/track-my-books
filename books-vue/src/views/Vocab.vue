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
        <section id="vocab-chart-section"></section>
        <VocabWordList
          :activeWordId="activeWordId"
          :updateActiveWord="updateActiveWordHandler"
          :vocabWords="getFilteredVocabList()"
        />
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import VocabSidebar from '@/components/VocabSidebar.vue';
import VocabWordList from '@/components/VocabWordList.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { VOCAB_GROUP_TYPES } from '@/util/Constants';
import Api from '@/util/Api';

export default {
  components: {
    LoadingIndicator,
    NavBar,
    VocabSidebar,
    VocabWordList,
  },
  data() {
    return {
      activeWordId: null,
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
    getFilteredVocabList() {
      return this.data.filter((w) => this.selectedFilterValue === 'All' || w[this.filterType.prop] === this.selectedFilterValue);
    },
    resolveData(data) {
      if (data.success) {
        this.loaded = true;
        this.data = data.results;
      } else {
        this.loaded = false;
        this.data = data.results;
      }
    },
    updateActiveWordHandler(newActiveId) {
      this.activeWordId = this.activeWordId === newActiveId ? null : newActiveId;
    },
    updateFilterType(newVal) {
      this.selectedFilterValue = 'All';
      this.filterType = newVal;
    },
    updateFilterValue(newVal) {
      this.selectedFilterValue = newVal === this.selectedFilterValue ? 'All' : newVal;
      const isActiveWordOfNewType = this.data
        .find(
          (w) => w.id === this.activeWordId
          && w[this.filterType.prop] === newVal,
        );
      this.activeWordId = isActiveWordOfNewType || this.selectedFilterValue === 'All' ? this.activeWordId : null;
    },
  },
};
</script>
