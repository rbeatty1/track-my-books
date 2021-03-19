import { createApp } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faStar,
  faBook,
  faTabletAlt,
  faHeadphones,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';
import router from './router';

library.add(faStar);
library.add(faBook);
library.add(faTabletAlt);
library.add(faHeadphones);

createApp(App)
  .use(router)
  .component('apex-chart', VueApexCharts)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
