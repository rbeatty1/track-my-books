import { createRouter, createWebHashHistory } from 'vue-router';
import Landing from '../views/Landing.vue';
import Books from '../views/Books.vue';
import Vocab from '../views/Vocab.vue';
import Admin from '../views/Admin.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Landing,
  },
  {
    path: '/books',
    name: 'Books',
    component: Books,
  },
  {
    path: '/vocabulary',
    name: 'Vocab',
    component: Vocab,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export {
  router as default,
  routes,
};
