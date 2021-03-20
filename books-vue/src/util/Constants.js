import { placeHolder } from './Helpers';

const VOCAB_GROUP_TYPES = {
  GENRE: {
    code: 0,
    prop: 'genre',
    label: 'Genre',
  },
  TITLE: {
    code: 1,
    prop: 'book',
    label: 'Book Title',
  },
  TYPE: {
    code: 2,
    prop: 'type',
    label: 'Word Type',
  },
};

const VOCAB_CHART_OPTIONS = {
  area: {
    chart: {
      type: 'area',
      background: '#eee',
      fontFamily: 'Oswald',
      id: 'vocab-line-chart',
      toolbar: false,
    },
    colors: ['#DD9F03', '#b54a3f', '#d17f54', '#e9b376', '#ffe7a4'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Words Over Time',
      style: {
        color: '#DD9F03',
        fontSize: '24px',
        fontFamily: 'Bebas Neue',
      },
    },
    xaxis: {
      type: 'datetime',
    },
  },
  treemap: {
    chart: {
      background: '#eee',
      fontFamily: 'Oswald',
      id: 'vocab-treemap-chart',
      parentHeightOffset: 25,
      toolbar: false,
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
    theme: {
      palette: 'palette7',
    },
    title: {
      text: 'Words By Type',
      style: {
        color: '#920034',
        fontSize: '24px',
        fontFamily: 'Bebas Neue',
      },
    },
  },
};
export {
  VOCAB_CHART_OPTIONS,
  VOCAB_GROUP_TYPES,
  placeHolder,
};
