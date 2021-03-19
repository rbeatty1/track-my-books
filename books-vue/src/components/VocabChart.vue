<template>
  <div class="vocab-chart">
    <apex-chart
      :series="getDataSeries()"
      :type="chartType"
      width="100%"
      height="100%"
      :options="getChartOptions()"
    />
  </div>
</template>

<script>
import { VOCAB_CHART_OPTIONS } from '@/util/Constants';

export default {
  props: {
    activeWordId: Number,
    chartType: String,
    groupType: Object,
    vocabWords: Array,
  },
  methods: {
    getChartOptions() {
      return VOCAB_CHART_OPTIONS[this.chartType];
    },
    getDataSeries() {
      const series = [
        {
          name: 'Word Count',
          data: [],
        },
      ];
      [...new Set(this.vocabWords)]
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map((w) => series[0].data.push([w.timestamp, series[0].data.length + 1]));

      return series;
    },
  },
};
</script>
