<template>
  <div id="new-book-modal">
    <form>
      <label>
        <input
          type="text"
          v-model="title"
          placeholder="Title"
        >
      </label>
      <label>
        <input
          type="text"
          v-model="author"
          placeholder="Author"
        >
      </label>
      <select
        v-model="genre"
        aria-placeholder="Genre"
      >
        <option
          v-for="g in genresOptions"
          :key="g"
          :value="g"
        >{{ g }}</option>
      </select>
      <label>
        <span>Started on</span>
        <input
          type="date"
          v-model="start"
        >
      </label>
      <label>
        <span>Finished on</span>
        <input
          type="date"
          v-model="end"
        >
      </label>
      <label>
        <input
          type="number"
          v-model="pages"
          placeholder="Pages"
        >
      </label>
      <select
        v-model="format"
      >
        <option value="0">Physical</option>
        <option value="1">E-Book</option>
        <option value="2">Audiobook</option>
      </select>
      <BookRatingInput
        v-show="start !== null && end !== null"
        :propogateRatingValue="setRating"
      />
    </form>
      <button
        @click="submitNewBook"
        type="button"
        v-show="showSubmitButton()"
      >Submit</button>
  </div>
</template>

<script>
import { BOOK_GENRES } from '@/util/Constants';
import ApiWrapper from '../util/Api';
import BookRatingInput from './BookRatingInput.vue';

export default {
  components: {
    BookRatingInput,
  },
  props: {
    data: Object,
    toggleModal: Function,
    updateBooksData: Function,
  },
  data() {
    return {
      author: null,
      end: null,
      format: 0,
      genre: BOOK_GENRES[0],
      genresOptions: BOOK_GENRES,
      pages: null,
      rating: 1,
      start: null,
      title: null,
    };
  },
  methods: {
    setRating(rating) {
      this.rating = rating;
    },
    showSubmitButton() {
      const requiredProps = [
        'title',
        'author',
        'genre',
        'start',
        'pages',
        'format',
      ];
      const enteredProps = requiredProps
        .filter((p) => this[p] !== null);
      const isButtonShown = enteredProps.length === requiredProps.length;
      return isButtonShown;
    },
    submitNewBook() {
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
      const bookData = {
        author: this.author,
        end: this.end,
        format: this.format,
        genre: this.genre,
        pages: this.pages,
        rating: this.rating,
        start: this.start,
        title: this.title,
      };
      new ApiWrapper({ endpoint: 'books' })
        .postData(
          bookData,
          {
            method: 'PUT',
            success: successFn,
            failure: failureFn,
          },
        );
    },
  },
};
</script>
