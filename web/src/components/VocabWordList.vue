<template>
  <section
    id="vocab-word-list"
    :class="[activeWordId !== null ? 'active' : '']"
  >
    <header>
      <span><strong>{{ vocabWords.length }}</strong> Words</span>
      <span><strong>Average Word Length:</strong> {{ calculateAvgWordLength() }} </span>
    </header>
    <div id="vocab-info-container">
      <article>
        <ul>
          <li
            :class="[activeWordId === w.id ? 'active' : null]"
            v-for="w in vocabWords"
            :key="w.id"
            @click="updateActiveWord(w.id)"
          >{{ w.word }}</li>
        </ul>
      </article>
      <ActiveWordSection
        :activeWord="getActiveWord()"
        v-if="activeWordId !== null"
      />
    </div>
  </section>
</template>

<script>
import ActiveWordSection from './VocabActiveWordSection.vue';

export default {
  components: {
    ActiveWordSection,
  },
  props: {
    activeWordId: Number,
    updateActiveWord: Function,
    vocabWords: Array,
  },
  methods: {
    calculateAvgWordLength() {
      return Math.ceil(
        this.vocabWords
          .reduce(
            (acc, cur) => acc + cur.word.length, 0,
          )
          / this.vocabWords.length,
      );
    },
    getActiveWord() {
      return this.activeWordId && this.vocabWords.find((w) => w.id === this.activeWordId);
    },
  },
};
</script>
