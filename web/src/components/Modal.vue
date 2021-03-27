<template>
  <div id="modal-bg">
    <div id="modal">
      <header>
        <h3>{{ title }}</h3>
        <font-awesome-icon
          @click="toggleModal(null, {})"
          :icon="['fas', 'times']"
        />
      </header>
      <section>
        <slot></slot>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    toggleModal: Function,
    title: String,
  },
};
</script>
