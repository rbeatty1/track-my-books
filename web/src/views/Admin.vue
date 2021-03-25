<template>
<div id="admin-page" :class="[success ? 'success' : error ? 'failure' : '']">
  <h1 v-if="error">No, you don't. Try again.</h1>
  <h1 v-else-if="!error && !success">Do you have what it takes?</h1>
  <section>
    <form v-if="!success">
      <input
        id="username"
        v-model="user"
        type="text"
        placeholder="Username"
        />
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Password"
        />
      <button
        type="button"
        @click="attemptAuthentication"
      >Authenticate</button>
    </form>
    <h2 v-else>Good job. Click <router-link to='/'>here</router-link> to enter the app</h2>
  </section>
</div>
</template>

<script>
import Api from '../util/Api';

export default {
  data() {
    return {
      error: false,
      password: null,
      success: false,
      user: null,
    };
  },
  methods: {
    attemptAuthentication() {
      const authCallback = (result) => {
        if (result[0].auth) {
          this.error = false;
          this.success = true;
          localStorage.setItem('jwtAccessToken', result[0].auth);
        } else {
          this.success = false;
          this.error = true;
        }
      };
      const api = new Api({ endpoint: 'login' });
      api.userAuthentication(this.user, this.password, authCallback.bind(this));
    },
  },
};
</script>
