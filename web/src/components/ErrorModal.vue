<template>
  <div>
    <h3>Uh oh! Something went wrong.</h3>
    <h5>{{ data.msg }}</h5>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },
};
</script>
