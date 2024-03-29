<template>
  <div :class="[isAdmin ? 'page-container admin' : 'page-container']" id="books-page">
    <NavBar/>
    <Modal
      :toggleModal="toggleBookModal"
      :title="modal.type === 'new'
        ? 'New Book'
        : modal.type === 'edit'
        ? 'Edit Book'
        : modal.type === 'error'
        ? 'Error'
        : ''"
      v-show="modal.open"
      :class="`${modal.type}-modal`"
    >
      <NewBookModal
        v-if="modal.type === 'new'"
        :toggleModal="toggleBookModal"
        :updateBooksData="updateBooksData"
      />
      <EditBookModal
        v-else-if="modal.type === 'edit'"
        :data="modal.data"
        :toggleModal="toggleBookModal"
        :updateBooksData="updateBooksData"
      />
      <ErrorModal
        v-else-if="modal.type === 'error'"
        :data="modal.data"
        :toggleModal="toggleBookModal"
      />
    </Modal>
    <main>
      <LoadingIndicator v-if="!loaded"/>
      <span v-else>
        <div id="books-banner">
          <BooksTotalSummary
            :booksData="data"
          />
          <button
            id="open-book-modal"
            v-show="isAdmin"
            type="button"
            @click="toggleBookModal('new')"
            >
              <font-awesome-icon
                :icon="['fas', 'plus']"
              />
          </button>
        </div>
        <MobileYearSectionNav
          :years="years"
          :openIdx="openIdx"
          :updateOpenIdx="updateOpenIdx"
        />
        <YearlyBookSection
          v-for="(year, idx) in years"
          :key="year"
          :booksData="getBooksByYear(year)"
          :year="year"
          :open="openIdx === idx"
          :updateOpenIdx="updateOpenIdx"
          :toggleBookModal="toggleBookModal"
        />
      </span>
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import BooksTotalSummary from '@/components/BooksTotalSummary.vue';
import YearlyBookSection from '@/components/YearlyBookSection.vue';
import MobileYearSectionNav from '@/components/MobileYearSectionNav.vue';
import Modal from '@/components/Modal.vue';
import NewBookModal from '@/components/NewBookModal.vue';
import EditBookModal from '@/components/EditBookModal.vue';
import ErrorModal from '@/components/ErrorModal.vue';
import Api from '@/util/Api';

export default {
  components: {
    BooksTotalSummary,
    EditBookModal,
    ErrorModal,
    MobileYearSectionNav,
    Modal,
    NavBar,
    NewBookModal,
    YearlyBookSection,
  },
  data() {
    return {
      api: new Api({ endpoint: 'books' }),
      data: null,
      isAdmin: localStorage.getItem('jwtAccessToken') !== null,
      loaded: false,
      modal: { open: false, type: null, data: null },
      openIdx: 0,
      years: null,
    };
  },
  created() {
    if (!this.loaded) {
      this.api.getData(this.resolveData);
    }
  },
  methods: {
    getUniqueYears() {
      const bookYears = [...new Set(this.data.map((b) => new Date(b.start).getFullYear()))];
      return bookYears;
    },
    getBooksByYear(year) {
      const filtered = this.data.filter((b) => (b.end && new Date(b.end).getFullYear() === year)
        || (!b.end && new Date(b.start).getFullYear() === year));
      return filtered.sort((a, b) => (a.end && b.end) && new Date(a.end) < new Date(b.end));
    },
    toggleBookModal(type, data, isOpen = !this.modal.open) {
      this.modal = {
        open: isOpen,
        type,
        data,
      };
    },
    resolveData(data) {
      if (data.success) {
        this.loaded = true;
        this.data = data.results;
        this.years = this.getUniqueYears();
      } else {
        this.loaded = false;
        this.data = data.results;
      }
    },
    updateBooksData(newData) {
      // const clone = [...this.data];
      const existingIdx = this.data.findIndex((d) => d.id === newData.id);
      if (existingIdx === -1) this.data.unshift(newData);
      else {
        this.data[existingIdx] = newData;
      }
      // this.data = clone;
    },
    updateOpenIdx(year) {
      const yearIdx = this.years.indexOf(year);
      this.openIdx = yearIdx === this.openIdx ? null : yearIdx;
    },
  },
};
</script>
