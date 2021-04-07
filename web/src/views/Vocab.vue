<template>
  <div class='page-container' id='vocab-page'>
    <NavBar/>
    <Modal
      :toggleModal="toggleVocabModal"
      :title="modal.type === 'vocab-info'
        ? 'Vocabulary Data Disclaimer'
        : ''"
      v-show="modal.open"
      :class="`${modal.type}-modal`"
    >
      <VocabDisclaimerModal
        v-if="modal.type === 'vocab-info'"
      />
    </Modal>
    <LoadingIndicator v-if='!loaded'/>
    <main v-else>
      <button
        id="show-mobile-filters"
        type="button"
        @click="toggleMobileFilters"
      >Show Filters</button>
      <VocabSidebar
        :filterType='filterType'
        :mobileFiltersActive='mobileFiltersActive'
        :selectedFilterValue="selectedFilterValue"
        :toggleMobileFilters="toggleMobileFilters"
        :toggleVocabModal="toggleVocabModal"
        :updateFilterTypeAction="updateFilterType"
        :updateFilterValue="updateFilterValue"
        :vocabData='data'
      />
      <div id="vocab-page-content">
        <section id="vocab-chart-section">
          <VocabChart
            :activeChart="'area' === activeChart"
            :activeWordId="activeWordId"
            chartType="area"
            :groupType="filterType"
            :vocabWords="getFilteredVocabList()"
          />
          <VocabChart
            :activeChart="'treemap' === activeChart"
            :groupType="filterType"
            :vocabWords="getFilteredVocabList()"
            chartType="treemap"
          />
        </section>
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
import Modal from '@/components/Modal.vue';
import NavBar from '@/components/NavBar.vue';
import VocabChart from '@/components/VocabChart.vue';
import VocabDisclaimerModal from '@/components/VocabDisclaimerModal.vue';
import VocabSidebar from '@/components/VocabSidebar.vue';
import VocabWordList from '@/components/VocabWordList.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { VOCAB_GROUP_TYPES } from '@/util/Constants';
import Api from '@/util/Api';

export default {
  components: {
    LoadingIndicator,
    Modal,
    NavBar,
    VocabChart,
    VocabDisclaimerModal,
    VocabSidebar,
    VocabWordList,
  },
  data() {
    return {
      activeChart: 'area',
      activeWordId: null,
      api: new Api({ endpoint: 'vocab' }),
      data: null,
      filterType: VOCAB_GROUP_TYPES.GENRE,
      loaded: false,
      mobileFiltersActive: false,
      modal: { open: false, type: null, data: null },
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
    toggleVocabModal(type, data, isOpen = !this.modal.open) {
      this.modal = {
        open: isOpen,
        type,
        data,
      };
    },
    toggleMobileFilters() {
      this.mobileFiltersActive = !this.mobileFiltersActive;
    },
    updateActiveChartHandler(newActiveChart) {
      this.activeChart = newActiveChart;
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
