<template>
  <aside>
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
    selectedFilterValue: String,
    updateFilterTypeAction: Function,
    updateFilterValue: Function,
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
