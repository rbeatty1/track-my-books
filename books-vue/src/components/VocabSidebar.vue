<template>
  <div
    :class="[mobileFiltersActive ? 'active' : '']"
    id="vocab-filters-bg-wrapper"
    v-if="mobileView"
  >
    <aside>
      <header>
        <select
          @change="updateFilterTypeHandler"
        >
          <option
            value="0"
            :selected="0 === filterType.code"
          >Genre</option>
          <option
            value="1"
            :selected="1 === filterType.code"
          >Book Title</option>
          <option
            value="2"
            :selected="2 === filterType.code"
          >Word Type</option>
        </select>
        <button
          @click="toggleMobileFilters"
          type="button"
          aria-controls="vocab-filters-bg-wrapper"
        ><font-awesome-icon :icon="['fas', 'times']"/></button>
      </header>
      <ul>
        <li
          v-for='val in getUniqueGroupValues()'
          :key='val'
        >
          <button
            @click="updateFilterValue(val)"
            :class="[val === selectedFilterValue ? 'active' : '']"
            type="button"
          >{{ val  }}</button>
        </li>
      </ul>
    </aside>
  </div>
  <aside v-else>
    <select
      @change="updateFilterTypeHandler"
    >
      <option
        value="0"
        :selected="0 === filterType.code"
      >Genre</option>
      <option
        value="1"
        :selected="1 === filterType.code"
      >Book Title</option>
      <option
        value="2"
        :selected="2 === filterType.code"
      >Word Type</option>
    </select>
      <button
        @click="updateFilterValue(val)"
        v-for='val in getUniqueGroupValues()'
        :key='val'
        :class="[val === selectedFilterValue ? 'active' : '']"
        type="button"
      >{{ val  }}</button>
  </aside>
</template>

<script>
import { VOCAB_GROUP_TYPES } from '@/util/Constants';

export default {
  props: {
    vocabData: Array,
    filterType: Object,
    mobileFiltersActive: Boolean,
    selectedFilterValue: String,
    toggleMobileFilters: Function,
    updateFilterTypeAction: Function,
    updateFilterValue: Function,
  },
  data() {
    return {
      mobileView: window.innerWidth <= 750,
    };
  },
  methods: {
    getUniqueGroupValues() {
      const uniqueSet = [
        ...new Set(
          this.vocabData
            .map((w) => w[this.filterType.prop]),
        ),
      ].sort((a, b) => a > b);
      uniqueSet.unshift('All');
      return uniqueSet;
    },
    updateFilterTypeHandler(event) {
      const newFilter = Object
        .keys(VOCAB_GROUP_TYPES)
        .filter((k) => VOCAB_GROUP_TYPES[k].code === parseInt(event.target.value, 10));
      this.updateFilterTypeAction(VOCAB_GROUP_TYPES[newFilter]);
    },
  },
};
</script>
