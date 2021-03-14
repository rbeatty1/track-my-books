<template>
  <nav class="header">
    <router-link class="home" to="/">track-my-books</router-link>
    <span>
      <input class="menu-btn" type="checkbox" id="menu-btn" />
      <label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
      <ul class="menu">
        <li><router-link to="/books">Books</router-link></li>
        <li><router-link to="/vocabulary">Vocabulary</router-link></li>
      </ul>
    </span>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
};
</script>
