<template>
  <div id="edit-book-modal">
    <span class="modal-body-title">
      <h3><strong>{{ data.title }}</strong> {{ data.author }}</h3>
    </span>
    <form>
      <span>
        <label for="start-date">
          Started:
          <input
          id="start-date"
          type="text"
          disabled="true"
          :value="getFormattedDateString(data.start)"
          >
        </label>
        <label for="end-date">
          Finished:
          <input
            id="end-date"
            v-model="endDate"
            type="date"
            :min="getMinDate()"
          >
        </label>
      </span>
      <span>
        <input type="number" v-show="false" v-model="rating">
        <font-awesome-icon
          :class="[rating === 1 ? 'disabled' : '']"
          @click="adjustRating('decrease')"
          :icon="['fas', 'minus']"
        />
        <font-awesome-icon
          v-for="i of rating"
          :key="i"
          :icon="['fas', 'star']"
        />
        <font-awesome-icon
          :class="[rating === 5 ? 'disabled' : '']"
          @click="adjustRating('increase')"
          :icon="['fas', 'plus']"
        />
      </span>
      <button
        v-show="rating > 0 && endDate !== null"
        type="button"
        @click="submitEdits"
      >Submit</button>
    </form>
  </div>
</template>

<script>
import ApiWrapper from '../util/Api';

export default {
  props: {
    data: Object,
    toggleModal: Function,
    updateBooksData: Function,
  },
  data() {
    return {
      endDate: null,
      rating: 1,
    };
  },
  methods: {
    adjustRating(direction) {
      if (direction === 'increase' && this.rating !== 5) this.rating += 1;
      if (direction === 'decrease' && this.rating !== 1) this.rating -= 1;
    },
    getFormattedDateString(date) {
      return new Date(date)
        .toLocaleDateString(
          'en-US',
          { month: 'numeric', day: 'numeric', year: 'numeric' },
        );
    },
    getMinDate() {
      const startDate = new Date(this.data.start);
      const month = startDate.getMonth() + 1;
      const date = startDate.getDate();
      return `${startDate.getFullYear()}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`;
    },
    submitEdits() {
      const failureFn = (res) => {
        this.toggleModal('error', res);
      };
      const successFn = (res) => {
        if (res.status_code === 200) {
          this.updateBooksData(res.data[0]);
          this.toggleModal();
        } else {
          failureFn(res);
        }
      };
      const bookData = { ...this.data };
      bookData.end = this.endDate;
      bookData.rating = this.rating;
      new ApiWrapper({ endpoint: 'books' })
        .postData(
          bookData,
          {
            method: 'PATCH',
            success: successFn,
            failure: failureFn,
          },
        );
    },
  },
};
</script>
