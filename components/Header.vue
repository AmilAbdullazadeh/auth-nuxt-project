<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-info shadow mb-5">
    <a class="navbar-brand" href>Auth</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <nuxt-link active-class="active" exact to="/" class="nav-item" tag="li">
          <a class="nav-link">Home page</a>
        </nuxt-link>
        <nuxt-link active-class="active" to="/about" class="nav-item" tag="li">
          <a class="nav-link">About</a>
        </nuxt-link>
      </ul>
      <ul :class="logoutClass" class="navbar-nav my-2 my-lg-0">
        <li class="nav-item">
          <a style="cursor: pointer;" @click.prevent="logout" class="nav-link">Log out</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Header",
methods: {
  logout() {
    this.$store.dispatch("logout");
    this.$router.push("/auth");
  },
},
  computed: {
    logoutClass() {
      return {
        "d-none" : !this.$store.getters.isAuthenticated
      }
    }
  }
};
</script>

<style scoped>
</style>