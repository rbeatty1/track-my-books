<template>
  <nav>
    <router-link class="home" to="/">track-my-books</router-link>
    <ul>
      <li><router-link to="/books">Books</router-link></li>
      <li><router-link to="/vocabulary">Vocabulary</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
};
</script>
