<template>
  <article id="active-word-section">
    <div id="active-word-info">
      <p>
        <strong>
          {{ activeWord.word }}
        </strong>
        ({{ activeWord.type }}): {{ activeWord.definition }}
      </p>
    </div>
    <div id="active-word-book">
      <p>
        <strong>
          {{ activeWord.book }}
        </strong>
        - {{ activeWord.author }}
      </p>
      <em>
        "{{ activeWord.context}}"
      </em>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    activeWord: Object,
  },
};
</script>
