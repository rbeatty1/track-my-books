<template>
  <div
    :class="[activeChart ? 'active ' : ''] + 'vocab-chart'"
    :id="'vocab-'+chartType"
  >
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
    activeChart: Boolean,
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
      const getWordsOverTimeSeries = () => {
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
      };
      const getTreemapSeries = () => {
        const processWordForSeries = (word, series) => {
          const isWordTypeInSeries = series.data.find((s) => s.x === word.type);
          if (!isWordTypeInSeries) {
            series.data.push({
              x: word.type,
              y: 1,
            });
          } else { isWordTypeInSeries.y += 1; }
        };
        const series = [{
          data: [],
        }];
        this.vocabWords
          .map((w) => processWordForSeries(w, series[0]));
        return series;
      };
      return this.chartType === 'area' ? getWordsOverTimeSeries() : getTreemapSeries();
    },
  },
};
</script>
