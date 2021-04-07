import { createApp } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBook,
  faHeadphones,
  faMinus,
  faPencilAlt,
  faPlus,
  faStar,
  faTabletAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';
import router from './router';

library.add(faBook);
library.add(faHeadphones);
library.add(faMinus);
library.add(faPencilAlt);
library.add(faPlus);
library.add(faStar);
library.add(faTabletAlt);
library.add(faTimes);

createApp(App)
  .use(router)
  .component('apex-chart', VueApexCharts)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
